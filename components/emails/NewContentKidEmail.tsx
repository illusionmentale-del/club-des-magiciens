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
    contentTitles: string[];
    loginUrl: string;
}

export const NewContentKidEmail = ({
    username,
    contentTitles = [],
    loginUrl,
}: NewContentKidEmailProps) => {
    const isPlural = contentTitles.length > 1;

    return (
        <Html>
            <Head />
            <Preview>{isPlural ? "De nouveaux contenus magiques sont disponibles ! 🎩✨" : "Un nouveau contenu magique est disponible ! 🎩✨"}</Preview>
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
                        <Section className="mt-[32px] text-center">
                            <span className="text-4xl">🪄</span>
                        </Section>
                        <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            {isPlural ? "Nouveaux Secrets Débloqués !" : "Nouveau Secret Débloqué !"}
                        </Heading>
                        <Text className="text-black text-[16px] leading-[24px]">
                            {isPlural ? (
                                <>Bonjour <strong>{username}</strong>, plusieurs nouveautés viennent d'arriver dans le Club, voici le résumé :</>
                            ) : (
                                <>Bonjour <strong>{username}</strong> !<br/><br/>Nous avons une excellente nouvelle pour toi : un tout nouveau contenu vient d'apparaître dans le Club des Petits Magiciens.</>
                            )}
                        </Text>
                        
                        <Section className="bg-brand-purple/5 border border-purple-200 rounded-lg p-6 my-6">
                            {isPlural ? (
                                <ul className="text-left m-0 p-0 pl-4">
                                    {contentTitles.map((title, index) => (
                                        <li key={index} className="text-[#5E5CE6] font-bold text-lg mb-2 leading-tight">
                                            {title}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Text className="text-[#5E5CE6] text-center font-black text-xl m-0 uppercase tracking-wide">
                                    {contentTitles[0] || "Contenu Mystère"}
                                </Text>
                            )}
                        </Section>

                        <Text className="text-black text-[16px] leading-[24px] text-center mb-6">
                            Connecte-toi vite à ton espace pour découvrir {isPlural ? "ces nouveaux secrets" : "ce nouveau secret"} et continuer ton apprentissage !
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#5E5CE6] rounded text-white text-[14px] font-bold no-underline text-center px-6 py-4"
                                href={loginUrl}
                            >
                                {isPlural ? "DÉCOUVRIR LES CONTENUS 🎩" : "DÉCOUVRIR LE CONTENU 🎩"}
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
