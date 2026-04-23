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

interface WelcomeVIPAdultEmailProps {
    fullName: string;
    email: string;
    password?: string;
    loginUrl: string;
    recoveryUrl?: string;
}

export const WelcomeVIPAdultEmail = ({
    fullName,
    email,
    password,
    loginUrl,
    recoveryUrl,
}: WelcomeVIPAdultEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenue dans l'Atelier ! 🎩✨</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                magic: {
                                    royal: "#2563eb",
                                    bg: "#0a0a0a",
                                },
                            },
                        },
                    },
                }}
            >
                <Body className="bg-[#f9fafb] my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] bg-white rounded my-[40px] mx-auto p-[30px] max-w-[465px] shadow-sm">
                        <Section className="mt-[20px] mb-[30px] text-center">
                            <Text className="text-[#2563eb] font-bold tracking-widest uppercase text-xs">
                                L'Atelier des Magiciens
                            </Text>
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
                            Bienvenue, {fullName}
                        </Heading>
                        <Text className="text-black text-[15px] leading-[26px]">
                            Suite à votre demande, j'ai le plaisir de vous offrir votre accès privilégié aux formations de l'Atelier. Votre compte a été validé avec succès.
                        </Text>
                        
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#2563eb] rounded text-white text-[13px] font-bold uppercase tracking-wider no-underline text-center px-8 py-4"
                                href={loginUrl}
                            >
                                ACCÉDER À L'ATELIER
                            </Button>
                        </Section>

                        <Section className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6 my-6 text-center">
                            <Text className="text-black font-bold text-[14px] my-1 uppercase tracking-wider">
                                Vos identifiants de connexion
                            </Text>
                            <Text className="text-black text-[14px] mt-4 mb-1">
                                E-mail : <strong>{email}</strong>
                            </Text>
                            {password && (
                                <Text className="text-black text-[14px] my-1">
                                    Mot de passe : <strong>{password}</strong>
                                </Text>
                            )}
                            <Text className="text-gray-500 text-[12px] mt-4 italic leading-relaxed">
                                (Par mesure de sécurité, vous pourrez modifier ce mot de passe depuis les paramètres de votre compte.)
                            </Text>
                        </Section>

                        <Text className="text-black text-[15px] leading-[26px] mt-6">
                            Au plaisir de vous retrouver de l'autre côté.
                            <br /><br />
                            <em>Jérémy Marouani</em>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeVIPAdultEmail;
