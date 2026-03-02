import * as React from "react";
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

interface WelcomeEmailProps {
    firstName?: string;
    magicLink?: string;
}

export default function WelcomeEmail({
    firstName = "Magicien",
    magicLink = "https://clubdespetitsmagiciens.fr/login",
}: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Votre accès Premium au nouveau Club des Magiciens est prêt ! 🪄</Preview>
            <Tailwind>
                <Body className="bg-[#f6f9fc] font-sans">
                    <Container className="bg-white mx-auto my-[40px] p-[20px] rounded shadow-sm max-w-[600px] border border-[#e5e7eb]">
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Img
                                src="https://zcljymosqckntukshzrm.supabase.co/storage/v1/object/public/website-assets/logo-v2.png"
                                width="120"
                                alt="Logo Club des Petits Magiciens"
                                className="mx-auto rounded-lg"
                            />
                        </Section>

                        <Heading className="text-[#1f2937] text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                            Bienvenue dans la nouvelle ère de la Magie !
                        </Heading>

                        <Text className="text-[#374151] text-[16px] leading-[24px]">
                            Bonjour {firstName},
                        </Text>

                        <Text className="text-[#374151] text-[16px] leading-[24px]">
                            Le <strong>Club des Petits Magiciens</strong> a totalement fait peau neuve !
                            Pour vous offrir une expérience digne des plus grands (Mode Cinéma, Hub Premium, Sécurité renforcée),
                            nous avons migré vers une toute nouvelle plateforme ultra-moderne.
                        </Text>

                        <Text className="text-[#374151] text-[16px] leading-[24px] mb-[32px]">
                            Votre compte a bien été transféré. <strong>Il ne vous reste plus qu'à l'activer en choisissant votre nouveau mot de passe.</strong>
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#6b21a8] rounded text-white text-[16px] font-bold no-underline text-center px-[30px] py-[16px] inline-block shadow-md"
                                href={magicLink}
                            >
                                Activer mon compte maintenant
                            </Button>
                        </Section>

                        <Text className="text-[#6b7280] text-[14px] leading-[24px] mt-[32px]">
                            Si le bouton ne fonctionne pas, copiez-collez l'URL suivante dans votre navigateur :<br />
                            <span className="text-[#2563eb] text-[12px]">{magicLink}</span>
                        </Text>

                        <Text className="text-[#374151] text-[16px] leading-[24px] mt-[32px]">
                            Nous avons hâte de vous retrouver de l'autre côté !<br />
                            L'équipe du Club.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
