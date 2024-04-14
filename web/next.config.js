const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

if (
    process.env.LD_LIBRARY_PATH == null ||
    !process.env.LD_LIBRARY_PATH.includes(
        `${process.env.PWD}/node_modules/canvas/build/Release:`
    )
) {
    process.env.LD_LIBRARY_PATH = `${
        process.env.PWD
    }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ""}`;
}

module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            swcMinify: true,
            reactStrictMode: true,
            images: {
                domains: [
                    "www.w3schools.com",
                    "emojipedia-us.s3.dualstack.us-west-1.amazonaws.com",
                    "upload.wikimedia.org",
                    "localhost",
                    "127.0.0.1",
                    "95.217.87.137:3051",
                ],
            },
            serverRuntimeConfig: {
                apiUrl: process.env.NEXT_PUBLIC_INTERNAL_API_URL,
            },
            publicRuntimeConfig: {
                apiUrl: process.env.NEXT_PUBLIC_API_URL,
            },
        };
    }

    return {
        output: process.env.NEXT_OUTPUT,
        swcMinify: true,
        images: {
            domains: [
                "www.w3schools.com",
                "emojipedia-us.s3.dualstack.us-west-1.amazonaws.com",
                "upload.wikimedia.org",
                "localhost",
                "95.217.87.137:3051",
            ],
        },
        serverRuntimeConfig: {
            apiUrl: process.env.NEXT_PUBLIC_INTERNAL_API_URL,
        },
        publicRuntimeConfig: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
        },
    };
};
