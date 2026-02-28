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

interface WelcomeAdultEmailProps {
    username: string;
    password?: string;
    loginUrl: string;
}

export const WelcomeAdultEmail = ({
    username,
    password,
    loginUrl,
}: WelcomeAdultEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue dans L'Atelier des Magiciens 🎩✨</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                magic: {
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
                        <Section className="mt-[32px] text-center">
                            {/* Optionnel: Logo Adulte si disponible, sinon on garde l'esprit épuré */}
                            <Heading className="text-black text-[28px] font-bold text-center p-0 my-[10px] mx-0">
                                L'Atelier des Magiciens
                            </Heading>
                        </Section>
                        <Heading className="text-black text-[22px] font-normal text-center p-0 my-[20px] mx-0">
                            🪄 Bienvenue dans le Cercle.
                        </Heading>
                        <Text className="text-black text-[15px] leading-[24px]">
                            Félicitations ! Votre adhésion est confirmée. Vous avez désormais accès à l'intégralité de <strong>L'Atelier des Magiciens</strong>. De puissants secrets et Masterclass vous attendent pour élever votre art de la prestidigitation.
                        </Text>
                        <Section className="bg-[#fff9f0] border border-[#fbbf24]/30 rounded-lg p-6 my-6 text-center">
                            {password ? (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Voici vos identifiants d'accès provisoires :
                                    </Text>
                                    <Text className="text-black text-md mt-4">
                                        Email : <strong>{username}</strong>
                                    </Text>
                                    <Text className="text-black text-md my-1">
                                        Mot de passe : <strong>{password}</strong>
                                    </Text>
                                    <Text className="text-gray-600 text-[13px] mt-4 italic">
                                        (Nous vous recommandons de le modifier une fois connecté dans "Mon Profil")
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-black font-bold text-lg my-1">
                                        Votre compte est déjà actif !
                                    </Text>
                                    <Text className="text-gray-600 text-sm mt-2">
                                        Vos accès ont été rattachés à votre adresse email habituelle : <strong>{username}</strong>.
                                    </Text>
                                </>
                            )}
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#fbbf24] rounded text-black text-[14px] font-bold no-underline text-center px-6 py-4"
                                href={loginUrl}
                            >
                                ACCÉDER À L'ATELIER
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            À très vite au QG,
                            <br />
                            <em>L'équipe de L'Atelier</em>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeAdultEmail;
