module.exports = {
    siteMetadata: {
        title: "My Gatsby Site",
    },
    plugins: [
        "gatsby-plugin-sass",
        "gatsby-plugin-image",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sitemap",
        {
            resolve: `gatsby-plugin-typescript`,
            options: {
                isTSX: true, // defaults to false
                jsxPragma: `jsx`, // defaults to "React"
                allExtensions: true, // defaults to false
            },
        },
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: `Vant Taro`,
                short_name: `Vant Taro`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#4fc08d`,
                display: `minimal-ui`,
                icon: "src/images/icon.png",
                theme_color_in_head: false,
            },
        },
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: "./src/images/",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: "./src/pages/",
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "content",
                path: "./content/",
            },
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    'gatsby-remark-autolink-headers',
                    {
                        resolve: 'gatsby-remark-prismjs',
                        options: {
                            // classPrefix: 'gatsby-code-',
                            inlineCodeMarker: '÷',
                        },
                    },
                    'gatsby-remark-smartypants',
                    {
                        resolve: 'gatsby-remark-external-links',
                        options: {
                            target: '_blank',
                        },
                    },
                ]
            }
        },
    ],

};