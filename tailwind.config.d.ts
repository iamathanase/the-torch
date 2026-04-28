declare const config: {
    darkMode: ["class"];
    content: string[];
    theme: {
        extend: {
            colors: {
                border: string;
                input: string;
                ring: string;
                background: string;
                foreground: string;
                primary: {
                    DEFAULT: string;
                    foreground: string;
                    glow: string;
                };
                secondary: {
                    DEFAULT: string;
                    foreground: string;
                };
                destructive: {
                    DEFAULT: string;
                    foreground: string;
                };
                muted: {
                    DEFAULT: string;
                    foreground: string;
                };
                accent: {
                    DEFAULT: string;
                    foreground: string;
                };
                popover: {
                    DEFAULT: string;
                    foreground: string;
                };
                card: {
                    DEFAULT: string;
                    foreground: string;
                };
                harvest: {
                    DEFAULT: string;
                    foreground: string;
                };
                sidebar: {
                    DEFAULT: string;
                    foreground: string;
                    primary: string;
                    "primary-foreground": string;
                    accent: string;
                    "accent-foreground": string;
                    border: string;
                };
            };
            fontFamily: {
                display: [string, string, string];
                sans: [string, string, string];
            };
            borderRadius: {
                lg: string;
                md: string;
                sm: string;
            };
            boxShadow: {
                soft: string;
            };
        };
    };
    plugins: any[];
};
export default config;
