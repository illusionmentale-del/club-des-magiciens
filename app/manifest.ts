import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const headerList = await headers();
    const host = headerList.get("host") || "";
    const isAdultsDomain = host.includes('atelierdesmagiciens') || host.startsWith('atelier.');

    if (isAdultsDomain) {
        return {
            name: "L'Atelier des Magiciens",
            short_name: "L'Atelier",
            description: "L'Atelier des Magiciens - Le Netflix de la Magie",
            start_url: '/dashboard',
            display: 'standalone',
            background_color: '#050507',
            theme_color: '#Fcd34d',
            icons: [
                {
                    src: '/favicon.ico',
                    sizes: 'any',
                    type: 'image/x-icon',
                },
            ],
        }
    }

    return {
        name: 'Club des Petits Magiciens',
        short_name: 'Le Club',
        description: 'Apprends la magie pas à pas',
        start_url: '/kids',
        display: 'standalone',
        background_color: '#15111B',
        theme_color: '#8B5CF6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
