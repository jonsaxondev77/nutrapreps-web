"use client"

import { bunnyImageField } from "@/lib/fields/BunnyImageField";
import { richTextField } from "@/lib/fields/RichTextField";
import { ReactIconMap, ReactIconOptions } from "@/utils/ReactIconsMap";
import { ComponentConfig, Fields } from "@measured/puck";
import Image from "next/image";
import React from "react";

// Add a 'variant' prop to choose the style
export type CardProps = {
    variant?: 'default' | 'simple';
    heading: string;
    snippet: string;
    mediaType?: 'none' | 'icon' | 'image';
    iconBgColor?: string;
    iconName?: string;
    imageSrc?: string;
    imageAlt?: string;
    buttonDisabled?: boolean;
    buttonText?: string;
    buttonLink?: string;
    buttonIcon?: string;
}

export const Card: ComponentConfig<CardProps> = {
    resolveFields: (data) => {
        const fields: Fields<CardProps> = {
            variant: {
                type: 'radio',
                label: 'Style',
                options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Simple Centered', value: 'simple' },
                ]
            },
            heading: { type: 'text', label: 'Card Heading' },
            snippet: richTextField('Snippet'),
            mediaType: {
                type: "radio",
                label: 'Media Type',
                options: [
                    { value: 'none', label: 'No Media' },
                    { value: 'icon', label: 'Icon' },
                    { value: 'image', label: 'Image' },
                ],
            }
        };

        if (data.props.mediaType == 'icon') {
            fields.iconName = {
                type: 'select',
                label: 'Select icon',
                options: ReactIconOptions
            }
            fields.iconBgColor = {
                type: 'select',
                label: 'Icon Background Color',
                options: [
                    { value: 'bg-green-100', label: 'Light Green' },
                    { value: 'bg-blue-500', label: 'Blue' },
                    { value: 'bg-indigo-500', label: 'Indigo' },
                    { value: 'bg-purple-500', label: 'Purple' },
                    { value: 'bg-green-500', label: 'Green' },
                    { value: 'bg-red-500', label: 'Red' },
                    { value: 'bg-yellow-500', label: 'Yellow' },
                    { value: 'bg-gray-500', label: 'Gray' },
                ],
            };
        } 
        else if (data.props.mediaType === 'image') {
            fields.imageSrc = bunnyImageField("Image Url");
            fields.imageAlt = { type: 'text', label: "Alt Text" };
        }

        if (data.props.variant === 'default') {
            fields.buttonDisabled = {
                type: 'radio',
                label: 'Show button',
                options: [ {value: false, label: 'Yes'}, {value: true, label: 'No'} ]
            }

            if (!data.props.buttonDisabled) {
                fields.buttonText = { type: 'text', label: 'Button Text' };
                fields.buttonLink = { type: 'text', label: 'Button URL' };
                fields.buttonIcon = { type: 'select', label: 'Button Icon', options: ReactIconOptions };
            }
        }

        return fields;
    },
    defaultProps: {
        variant: 'default',
        mediaType: 'icon',
        iconName: 'FaAdjust',
        iconBgColor: "bg-blue-500",
        heading: 'Scalable Solutions',
        snippet: 'Our platform is designed to grow with your business, providing robust and flexible solutions for every stage.',
        buttonDisabled: true,
        buttonText: 'Learn More',
        buttonLink: '/solutions',
        buttonIcon: 'FaHandPointRight',
    },
    render: ({ variant, heading, snippet, mediaType, iconName, iconBgColor, imageSrc, imageAlt, buttonDisabled, buttonText, buttonLink, buttonIcon }) => {
        const IconComponent = iconName ? ReactIconMap[iconName] : null;
        const ButtonIconComponent = buttonIcon ? ReactIconMap[buttonIcon] : null;

        if (variant === 'simple') {
            return (
                <div className="flex flex-col items-center text-center">
                    {mediaType === 'icon' && IconComponent && (
                        <div className={`p-6 rounded-full mb-4 ${iconBgColor}`}>
                            <div className="w-10 h-10 text-white">
                               {React.createElement(IconComponent, { size: "100%" })}
                            </div>
                        </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {heading}
                    </h3>
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: snippet }} />
                </div>
            );
        }

        const buttonClasses = `inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors duration-200 text-blue-700 bg-blue-100 hover:bg-blue-200`;

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full">
                {mediaType === 'icon' && IconComponent && (
                    <div className={`flex items-center justify-center w-16 h-16 text-white ${iconBgColor} rounded-full mb-6 mx-auto text-3xl`}>
                        {React.createElement(IconComponent)}
                    </div>
                )}

                {mediaType === 'image' && imageSrc && (
                    <div className="w-full h-48 mb-6 rounded-lg overflow-hidden mx-auto relative">
                        <Image
                            src={imageSrc}
                            alt={imageAlt || heading}
                            fill
                            sizes="100vw"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                    {heading}
                </h3>
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: snippet }}/>
                
                {buttonText && buttonLink && !buttonDisabled && (
                    <div className="mt-auto text-center">
                        <a href={buttonLink} className={buttonClasses}>
                            {buttonText}
                            {ButtonIconComponent && ( 
                                <span className="ml-2 text-lg">
                                    {React.createElement(ButtonIconComponent)}
                                </span>
                            )}
                        </a>
                    </div>
                )}
            </div>
        );
    }
}
