// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "InzaReference",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "InzaReference", targets: ["InzaReference"])
    ],
    targets: [
        .executableTarget(
            name: "InzaReference"
        )
    ]
)
