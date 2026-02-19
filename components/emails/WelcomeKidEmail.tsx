import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeKidEmailProps {
    username: string;
    password?: string;
    loginUrl: string;
    recoveryUrl?: string;
}

export const WelcomeKidEmail = ({
    username,
    password,
    loginUrl,
    recoveryUrl,
}: WelcomeKidEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue au Club des Petits Magiciens ! 🎩✨</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                magic: {
                                    purple: "#7c3aed",
                                    gold: "#fbbf24",
                                    bg: "#111827",
                                },
                            },
                        },
                    },
                }}
            >
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://clubdespetitsmagiciens.fr/logo.png" // Fallback or real logo URL
                                width="150"
                                height="150"
                                alt="Club des Petits Magiciens"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            {recoveryUrl ? "🪄 Accès au Club" : "Bienvenue jeune apprenti"} <strong>{username}</strong> !
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Félicitations ! Tu fais maintenant partie du <strong>Club des Petits Magiciens</strong>.
                            De nombreux secrets t'attendent pour devenir un grand magicien.
                        </Text>
                        <Section className="bg-gray-100 rounded-lg p-6 my-6 text-center">
                            <Text className="text-gray-500 text-xs uppercase font-bold mb-2 tracking-wider">
                                Tes codes secrets
                            </Text>
                            <Text className="text-black text-lg my-1">
                                Magigicien : <strong>{username}</strong>
                            </Text>
                            {password && (
                                <Text className="text-black text-lg my-1">
                                    Mot de passe : <strong>{password}</strong>
                                </Text>
                            )}
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#7c3aed] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3"
                                href={recoveryUrl || loginUrl}
                            >
                                {recoveryUrl ? "ME CONNECTER AUTOMATIQUEMENT ✨" : "ENTRER DANS LE CLUB 🎩"}
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Prépare ton jeu de cartes, l'aventure commence maintenant !
                            <br />
                            <em>L'équipe du Club</em>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeKidEmail;
