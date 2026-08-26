// Reads the committed print QR artifacts with Apple's own decoder — the engine behind
// the iPhone camera — and fails if any of them does not scan.
//
//     npm run pruef:druck-qr
//
// WHY THIS EXISTS, and it is not a nice-to-have.
//
// On 2026-08-26 the printed ordering address changed from the long Wolt URL to our own
// short `/bestellen` path. The QR matrix shrank with it, from 49x49 modules to 37x37, and
// at 37x37 the STYLED code — round modules, rounded finder eyes, centre emblem — stopped
// being readable by Vision entirely. Not marginal: no read at any render size.
//
// Nothing caught it. `docs/postkarte/qr.ts` carries its own decode check and that check
// stayed green, because it rasterises the finder eyes as SQUARES while the emitted SVG
// draws them ROUNDED, and then reads that different picture with jsQR. It was verifying a
// shape the artifact does not have. A guard that is green on an unscannable code is worse
// than no guard, because it is trusted.
//
// Measured, so the next person does not have to rediscover it:
//   - 37x37 (version 5) styled  -> no read, any size, both variants
//   - 41x41 (version 6) styled  -> no read
//   - 49x49 (version 8) styled  -> reads from ~400 px upward, both variants
//   - the same short URL as a PLAIN, unstyled code -> reads fine
// So the payload was never the problem. The styling costs robustness, and that cost is
// only affordable from version 8 upward. `qr.ts` pins the version for that reason.
//
// WHY jsQR IS NOT USED HERE. jsQR cannot read these styled codes at all — not even the
// version-8 ones that Vision and phones read without hesitation. It is a stricter, simpler
// detector. So the CI suite deliberately does NOT claim to decode the print artifacts; it
// checks the constants, the lock file and the geometry. THIS script is the readability
// gate, it is macOS-only, and it is a required step before any print order.

import Foundation
import Vision
import AppKit

// TAKES ALREADY-RASTERISED PNGs, deliberately. Rasterising the SVG here with NSImage was
// tried first and produced a FALSE NEGATIVE: an SVG-backed NSImage renders at its
// intrinsic size — 57 x 57 — and drawing it larger only upscales that blur, so perfectly
// good codes came back "unreadable". A gate that cries wolf on a healthy artifact would
// have been retired within a week. `scripts/scan-print-qr.mjs` renders with sharp, the
// same renderer the rest of the repo uses, and hands the pixels here.

func decode(_ path: String) -> String? {
    guard let image = NSImage(contentsOfFile: path),
          let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil)
    else { return nil }
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([request])
    return (request.results?.first as VNBarcodeObservation?)?.payloadStringValue
}

// argv: <expected-url> <label=png-path> ...
let args = Array(CommandLine.arguments.dropFirst())
let expected: String? = args.first
let artifacts = args.dropFirst().map { arg -> (label: String, path: String) in
    let parts = arg.split(separator: "=", maxSplits: 1).map(String.init)
    return parts.count == 2 ? (parts[0], parts[1]) : (arg, arg)
}

var failed = 0
for (label, path) in artifacts {
    guard FileManager.default.fileExists(atPath: path) else {
        print("  ✗ \(label): fehlt — zuerst: npx tsx docs/postkarte/qr.ts")
        failed += 1
        continue
    }
    guard let payload = decode(path) else {
        print("  ✗ \(label): NICHT LESBAR — dieser Code darf nicht in den Druck")
        failed += 1
        continue
    }
    if let expected, payload != expected {
        print("  ✗ \(label): zeigt auf \(payload), erwartet \(expected)")
        failed += 1
        continue
    }
    print("  ✓ \(label) -> \(payload)")
}

print("\nDruck-QR (Apple Vision): \(artifacts.count - failed) von \(artifacts.count) lesbar")
if failed > 0 { exit(1) }
