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
                                    purple: "#5E5CE6",
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
                            {password ? "Félicitations ! L'abonnement est validé et tu as maintenant accès au Club des Petits Magiciens. De nombreux secrets t'attendent pour découvrir l'art de la prestidigitation." : "Le Club des Petits Magiciens évolue !"}
                        </Text>
                        <Section className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-6 my-6 text-center">
                            {password ? (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Tu auras besoin des identifiants d'accès ci-dessous pour te connecter :
                                    </Text>
                                    <Text className="text-black text-md mt-4">
                                        Identifiant (ton adresse e-mail) : <strong>{username}</strong>
                                    </Text>
                                    <Text className="text-black text-md my-1">
                                        Mot de passe provisoire : <strong>{password}</strong>
                                    </Text>
                                    <Text className="text-gray-600 text-xs mt-4 italic">
                                        (Nous te conseillons de le modifier une fois connecté dans ton espace "Mon Profil")
                                    </Text>
                                    <Section className="text-center mt-[32px] mb-[16px]">
                                        <Button
                                            className="bg-[#5E5CE6] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3"
                                            href={loginUrl}
                                        >
                                            ENTRER DANS LE CLUB 🎩
                                        </Button>
                                    </Section>
                                </>
                            ) : (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Nouvelle Plateforme 100% Autonome 🚀
                                    </Text>
                                    <Text className="text-gray-600 text-sm mt-4 text-left">
                                        Bonjour ! Je t'envoie ce mail car le Club des Petits Magiciens a migré vers une nouvelle application 100% autonome.
                                    </Text>
                                    <Text className="text-gray-600 text-sm mt-3 text-left">
                                        Pour te connecter à ton espace, il te suffit de cliquer sur le bouton ci-dessous pour générer un nouveau mot de passe personnalisé. 
                                        Tu peux aussi te rendre sur la page de connexion, entrer ton adresse email (<strong>{username}</strong>) et cliquer sur "Mot de passe oublié".
                                    </Text>
                                    <Text className="text-gray-600 text-sm mt-3 text-left font-bold text-black border-l-4 border-[#fbbf24] pl-3 py-1">
                                        Bien évidemment, ton accès est gratuit et le restera à vie.
                                    </Text>
                                    <Section className="text-center mt-[32px] mb-[16px]">
                                        <Button
                                            className="bg-[#5E5CE6] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3"
                                            href={recoveryUrl || loginUrl}
                                        >
                                            CRÉER MON MOT DE PASSE 🔒
                                        </Button>
                                    </Section>
                                </>
                            )}
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            {password ? "Prépare ton jeu de cartes, l'aventure commence maintenant !" : "Amuse-toi bien au Club des Petits Magiciens !"}
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
