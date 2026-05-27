// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "MankiReference",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "MankiReference", targets: ["MankiReference"])
    ],
    targets: [
        .executableTarget(
            name: "MankiReference"
        )
    ]
)
