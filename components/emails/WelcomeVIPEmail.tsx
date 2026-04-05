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

interface WelcomeVIPEmailProps {
    childName: string;
    parentEmail: string;
    password?: string;
    loginUrl: string;
    recoveryUrl?: string;
}

export const WelcomeVIPEmail = ({
    childName,
    parentEmail,
    password,
    loginUrl,
    recoveryUrl,
}: WelcomeVIPEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Magie ! Ton accès offert au Club 🎩✨</Preview>
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
                                src="https://clubdespetitsmagiciens.fr/logo.png"
                                width="150"
                                height="150"
                                alt="Club des Petits Magiciens"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            🪄 Bienvenue au Club, {childName} !
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Comme convenu lors de notre rencontre en spectacle, j'ai le plaisir de t'offrir ton accès à vie au <strong>Club des Petits Magiciens</strong> ! De nombreux secrets t'attendent pour découvrir l'art de la prestidigitation.
                        </Text>
                        
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Text className="text-black text-[14px] mb-4">
                                Clique simplement sur le bouton magique ci-dessous. Tu n'as même pas besoin de taper de mot de passe, l'accès se fera automatiquement.
                            </Text>
                            <Button
                                className="bg-[#7c3aed] rounded text-white text-[12px] font-bold no-underline text-center px-6 py-4"
                                href={recoveryUrl || loginUrl}
                            >
                                ENTRER DANS LE CLUB 🎩
                            </Button>
                        </Section>

                        <Section className="bg-brand-purple/5 border border-brand-purple/20 rounded-lg p-5 my-6 text-center">
                            <Text className="text-black font-bold text-[14px] my-1">
                                Tes informations de connexion :
                            </Text>
                            <Text className="text-black text-[13px] mt-4 mb-1">
                                Email : <strong>{parentEmail}</strong>
                            </Text>
                            {password && (
                                <Text className="text-black text-[13px] my-1">
                                    Mot de passe provisoire : <strong>{password}</strong>
                                </Text>
                            )}
                            <Text className="text-gray-600 text-[12px] mt-4 italic leading-relaxed">
                                (Je te conseille d'aller dans "Mon Profil &gt; Paramètres" pour personnaliser ton mot de passe par sécurité)
                            </Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px] mt-6">
                            Prépare ton jeu de cartes, l'aventure commence maintenant !
                            <br /><br />
                            <em>L'équipe du Club</em>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeVIPEmail;
