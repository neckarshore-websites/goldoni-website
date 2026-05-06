#!/usr/bin/env bash
# cutover-verify.sh — End-to-End-Verifikation des DNS-Cutovers ristorante-goldoni.de
# Plan-Quelle: Vaults/Nexus/.../Ristorante Goldini/Goldoni DNS-Cutover.md
#
# Usage:
#   ./scripts/cutover-verify.sh
#
# Exit 0 = alle Checks grün, Exit >0 = Anzahl roter Checks.
# Re-runnable während Propagation — orange Felder werden grün, sobald DNS/SSL durch sind.

set -uo pipefail

DOMAIN="ristorante-goldoni.de"
WWW="www.${DOMAIN}"
EXPECTED_A="76.76.21.21"
EXPECTED_CNAME="cname.vercel-dns.com"
EXPECTED_MX_SUFFIX="mail.protection.outlook.com"

# Farben
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'
BOLD='\033[1m'

FAIL=0
PASS=0

check() {
  local label="$1"
  local actual="$2"
  local expected="$3"
  local mode="${4:-eq}" # eq | contains | not-empty

  printf "  %-45s " "${label}"
  case "${mode}" in
    eq)
      if [[ "${actual}" == "${expected}" ]]; then
        printf "${GREEN}✓${NC}  %s\n" "${actual}"
        PASS=$((PASS + 1))
      else
        printf "${RED}✗${NC}  got=%s want=%s\n" "${actual:-<empty>}" "${expected}"
        FAIL=$((FAIL + 1))
      fi
      ;;
    contains)
      if [[ "${actual}" == *"${expected}"* ]]; then
        printf "${GREEN}✓${NC}  %s\n" "${actual}"
        PASS=$((PASS + 1))
      else
        printf "${RED}✗${NC}  got=%s want=*%s*\n" "${actual:-<empty>}" "${expected}"
        FAIL=$((FAIL + 1))
      fi
      ;;
    not-empty)
      if [[ -n "${actual}" ]]; then
        printf "${GREEN}✓${NC}  %s\n" "${actual}"
        PASS=$((PASS + 1))
      else
        printf "${RED}✗${NC}  empty (expected non-empty)\n"
        FAIL=$((FAIL + 1))
      fi
      ;;
  esac
}

printf "\n${BOLD}Goldoni Cutover Verify${NC}  —  $(date '+%Y-%m-%d %H:%M:%S')\n"
printf "Domain: %s\n\n" "${DOMAIN}"

# ─── 1. DNS ─────────────────────────────────────────────────────────────────
printf "${BOLD}1. DNS Resolution${NC}\n"
A_APEX=$(dig +short "${DOMAIN}" A | head -1)
CNAME_WWW=$(dig +short "${WWW}" CNAME | head -1 | sed 's/\.$//')
A_WWW_FALLBACK=$(dig +short "${WWW}" A | head -1)
MX_APEX=$(dig +short "${DOMAIN}" MX | head -1)
WILDCARD_A=$(dig +short "subdomain-that-shouldnt-exist.${DOMAIN}" A | head -1)

check "A apex"                        "${A_APEX}"        "${EXPECTED_A}"           "eq"
check "CNAME www"                     "${CNAME_WWW}"     "${EXPECTED_CNAME}"       "eq"
check "MX preserved"                  "${MX_APEX}"       "${EXPECTED_MX_SUFFIX}"   "contains"
if [[ -n "${WILDCARD_A}" ]]; then
  printf "  %-45s ${YELLOW}!${NC}  wildcard still resolves: %s\n" "Wildcard cleanup" "${WILDCARD_A}"
else
  printf "  %-45s ${GREEN}✓${NC}  wildcard removed (NXDOMAIN)\n" "Wildcard cleanup"
  PASS=$((PASS + 1))
fi

# ─── 2. HTTP / HTTPS ────────────────────────────────────────────────────────
printf "\n${BOLD}2. HTTP/HTTPS Response${NC}\n"
HTTPS_APEX_STATUS=$(curl -sI --max-time 10 "https://${DOMAIN}" | awk 'NR==1{print $2}')
HTTPS_APEX_SERVER=$(curl -sI --max-time 10 "https://${DOMAIN}" | grep -i '^server:' | awk '{print $2}' | tr -d '\r')
HTTPS_WWW_STATUS=$(curl -sI --max-time 10 "https://${WWW}" | awk 'NR==1{print $2}')
HTTP_APEX_STATUS=$(curl -sI --max-time 10 "http://${DOMAIN}" | awk 'NR==1{print $2}')

check "HTTPS apex 200"                "${HTTPS_APEX_STATUS}"   "200"           "eq"
check "HTTPS apex server=Vercel"      "${HTTPS_APEX_SERVER}"   "Vercel"        "contains"
check "HTTPS www reachable"           "${HTTPS_WWW_STATUS}"    ""              "not-empty"
check "HTTP apex → redirect"          "${HTTP_APEX_STATUS}"    "30"            "contains"

# ─── 3. SSL Certificate ────────────────────────────────────────────────────
printf "\n${BOLD}3. SSL Certificate${NC}\n"
CERT_INFO=$(echo | openssl s_client -connect "${DOMAIN}:443" -servername "${DOMAIN}" 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates 2>/dev/null)
CERT_ISSUER=$(echo "${CERT_INFO}" | grep '^issuer=' | sed 's/^issuer=//')
CERT_SUBJECT=$(echo "${CERT_INFO}" | grep '^subject=' | sed 's/^subject=//')
CERT_NOTAFTER=$(echo "${CERT_INFO}" | grep '^notAfter=' | sed 's/^notAfter=//')

check "Cert subject matches domain"   "${CERT_SUBJECT}"  "${DOMAIN}"             "contains"
check "Cert issuer present"           "${CERT_ISSUER}"   ""                      "not-empty"
check "Cert expiry present"           "${CERT_NOTAFTER}" ""                      "not-empty"

# ─── 4. Vercel Domain Status (optional, requires CLI) ──────────────────────
printf "\n${BOLD}4. Vercel Domain Status${NC}\n"
if command -v vercel >/dev/null 2>&1; then
  VERCEL_OUT=$(vercel domains inspect "${DOMAIN}" 2>&1)
  if echo "${VERCEL_OUT}" | grep -q "${DOMAIN}"; then
    printf "  %-45s ${GREEN}✓${NC}  domain registered\n" "Vercel CLI inspect"
    PASS=$((PASS + 1))
  else
    printf "  %-45s ${RED}✗${NC}  CLI did not return domain info\n" "Vercel CLI inspect"
    FAIL=$((FAIL + 1))
  fi
else
  printf "  %-45s ${YELLOW}—${NC}  vercel CLI not installed (skipped)\n" "Vercel CLI inspect"
fi

# ─── Zusammenfassung ────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
printf "\n${BOLD}Summary${NC}  —  ${GREEN}%d passed${NC} / ${RED}%d failed${NC} (of %d checks)\n\n" \
  "${PASS}" "${FAIL}" "${TOTAL}"

if [[ "${FAIL}" -gt 0 ]]; then
  printf "${YELLOW}Tip:${NC} If DNS just changed, re-run in 1–5 min. Propagation/SSL can take up to 1h.\n\n"
fi

exit "${FAIL}"
