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

interface NewContentKidEmailProps {
    username: string;
    contentTitle: string;
    loginUrl: string;
}

export const NewContentKidEmail = ({
    username,
    contentTitle,
    loginUrl,
}: NewContentKidEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Un nouveau contenu magique est disponible ! 🎩✨</Preview>
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
                        <Section className="mt-[32px] text-center">
                            <span className="text-4xl">🪄</span>
                        </Section>
                        <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            Nouveau Secret Débloqué !
                        </Heading>
                        <Text className="text-black text-[16px] leading-[24px]">
                            Bonjour <strong>{username}</strong> !
                        </Text>
                        <Text className="text-black text-[16px] leading-[24px]">
                            Nous avons une excellente nouvelle pour toi : un tout nouveau contenu vient d'apparaître dans le Club des Petits Magiciens.
                        </Text>
                        
                        <Section className="bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-6 my-6 text-center">
                            <Text className="text-[#7c3aed] font-black text-xl m-0 uppercase tracking-wide">
                                {contentTitle}
                            </Text>
                        </Section>

                        <Text className="text-black text-[16px] leading-[24px] text-center mb-6">
                            Connecte-toi vite à ton espace pour découvrir ce nouveau secret et continuer ton apprentissage !
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#7c3aed] rounded text-white text-[14px] font-bold no-underline text-center px-6 py-4"
                                href={loginUrl}
                            >
                                DÉCOUVRIR LE CONTENU 🎩
                            </Button>
                        </Section>

                        <Text className="text-gray-500 text-[14px] leading-[24px]">
                            À très vite dans le Club !
                            <br />
                            <em>L'équipe du Club des Petits Magiciens</em>
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default NewContentKidEmail;
