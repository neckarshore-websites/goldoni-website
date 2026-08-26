// Reads the committed print QR artifacts with Apple's own decoder — the engine behind
// the iPhone camera — and fails if any of them does not scan.
//
//     npm run pruef:druck-qr
//
// WHY THIS EXISTS, and it is not a nice-to-have.
//
// On 2026-08-26 the printed ordering address moved to our own short `/bestellen` path and
// the QR matrix shrank from 49x49 modules to 37x37. At that size the emitted code stopped
// being readable at all — Apple Vision found nothing, at any render size, both colour
// variants. Confirmed on an actual iPhone before anything was changed.
//
// The cause was NOT the styling, which was the first suspect and the wrong one. An SVG
// stroke sits centred on the edge, so the finder patterns — drawn as 7x7 rects with a
// 1-module stroke — actually covered 8x8 and sat half a module off. Finder patterns are
// the first thing any decoder looks for. Measured: with the geometry corrected, seven
// different stylings all decode; without it, none of them do, including a completely plain
// one. The larger matrix had been forgiving of the same defect for months.
//
// NOTHING CAUGHT IT. `docs/postkarte/qr.ts` carries its own decode check and it stayed
// green throughout, because it rasterises its own picture from the module data at the
// CORRECT finder positions. It was verifying geometry the artifact did not have. A guard
// that is green on an unscannable code is worse than no guard, because it is trusted —
// and the fix is not a better rasteriser but a check that reads the DELIVERED file.
//
// WHY jsQR IS NOT USED HERE. jsQR cannot read these styled codes even when they are
// correct and phones read them instantly. It is a stricter, simpler detector. So the CI
// suite deliberately makes no claim about scannability; this script is the readability
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
