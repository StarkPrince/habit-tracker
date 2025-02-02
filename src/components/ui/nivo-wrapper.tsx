import { nivoTheme } from "@/lib/nivo-theme";
import merge from "lodash/merge";
import { useTheme } from "next-themes";
import React from "react";

interface NivoWrapperProps
{
    children: React.ReactNode;
    height?: number | string;
}

export const NivoWrapper: React.FC<NivoWrapperProps> = ({
    children,
    height = 400
}) =>
{
    const { theme: currentTheme } = useTheme();

    // Define animation settings separately (do not merge these into the theme)
    const baseAnimation = {
        animate: true,
        motionConfig: {
            mass: 1,
            tension: 170,
            friction: 26,
            clamp: false,
            precision: 0.01,
            velocity: 0,
        },
    };

    // Merge style-related theme overrides only
    const finalTheme = merge({}, nivoTheme, {
        background: 'transparent',
        textColor: currentTheme === 'dark' ? '#ffffff' : '#000000',
    });

    return (
        <div style={{ height, width: '100%' }}>
            {React.cloneElement(children as React.ReactElement, {
                theme: finalTheme,
                // Inject animation settings as top-level props
                animate: baseAnimation.animate,
                motionConfig: baseAnimation.motionConfig,
            })}
        </div>
    );
}; 