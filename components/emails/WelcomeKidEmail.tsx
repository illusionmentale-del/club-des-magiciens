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
                            🪄 Bienvenue au Club !
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Félicitations ! L'abonnement est validé et tu as maintenant accès au Club des Petits Magiciens. De nombreux secrets t'attendent pour découvrir l'art de la prestidigitation.
                        </Text>
                        <Section className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-6 my-6 text-center">
                            {password ? (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Voici tes identifiants d'accès :
                                    </Text>
                                    <Text className="text-black text-md mt-4">
                                        Email : <strong>{username}</strong>
                                    </Text>
                                    <Text className="text-black text-md my-1">
                                        Mot de passe provisoire : <strong>{password}</strong>
                                    </Text>
                                    <Text className="text-gray-600 text-xs mt-4 italic">
                                        (Nous te conseillons de le modifier une fois connecté dans ton espace "Mon Profil")
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Ton compte est déjà actif !
                                    </Text>
                                    <Text className="text-gray-600 text-sm mt-2">
                                        Connecte-toi avec tes identifiants habituels associés à l'email <strong>{username}</strong>.
                                    </Text>
                                    <Text className="text-gray-600 text-xs mt-2 italic">
                                        (Si tu as oublié ton mot de passe, clique sur "Mot de passe oublié" sur la page de connexion)
                                    </Text>
                                </>
                            )}
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#7c3aed] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3"
                                href={loginUrl}
                            >
                                ENTRER DANS LE CLUB 🎩
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
