// /components/emails/ReplyNotificationEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface ReplyNotificationEmailProps {
    kidName?: string;
    videoUrl?: string; // The link to the kids video page
    messageContent?: string;
    mediaTitle?: string;
}

export const ReplyNotificationEmail = ({
    kidName = "Apprenti Magicien",
    videoUrl = "https://clubdespetitsmagiciens.fr/kids",
    messageContent = "Le Magicien vient de répondre à ta question !",
    mediaTitle,
}: ReplyNotificationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Jérémy a répondu à ta question ! 🎩✨</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Img
                            src="https://clubdespetitsmagiciens.fr/logo.png"
                            width="80"
                            height="80"
                            alt="Club des Petits Magiciens"
                            style={logo}
                        />
                        <Heading style={h1}>Un message du Magicien !</Heading>
                    </Section>

                    <Section style={content}>
                        <Text style={greeting}>Bonjour {kidName},</Text>
                        <Text style={text}>
                            Jérémy a lu ton message et il vient tout juste d'y répondre depuis son repaire secret ! 🧙‍♂️
                        </Text>

                        <Section style={messageBox}>
                            <Text style={quoteText}>
                                "{messageContent}"
                            </Text>
                            {mediaTitle && (
                                <Text style={mediaIndicator}>
                                    🎁 Vidéo / PDF inclus : {mediaTitle}
                                </Text>
                            )}
                        </Section>

                        <Text style={text}>
                            Clique sur le bouton magique ci-dessous pour découvrir sa réponse directement sous ta vidéo :
                        </Text>

                        <Section style={buttonContainer}>
                            <Link href={videoUrl} style={button}>
                                Voir la réponse ! ✨
                            </Link>
                        </Section>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            Le Club des Petits Magiciens<br />
                            Prépare tes cartes, l'aventure continue !
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default ReplyNotificationEmail;

const main = {
    backgroundColor: "#130A2A", // Dark magic purple
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#1B0F3A",
    margin: "40px auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "24px",
    border: "1px solid #3B1B7D",
    maxWidth: "600px",
};

const header = {
    padding: "32px 48px",
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
    marginBottom: "16px",
};

const h1 = {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    margin: "0",
    textTransform: "uppercase" as const,
};

const content = {
    padding: "0 48px",
};

const greeting = {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "24px",
};

const text = {
    color: "#B4A2D4",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "24px",
};

const messageBox = {
    backgroundColor: "#2A185C",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    borderLeft: "4px solid #E4B851",
};

const quoteText = {
    color: "#ffffff",
    fontSize: "16px",
    lineHeight: "24px",
    fontStyle: "italic",
    margin: "0",
};

const mediaIndicator = {
    color: "#E4B851",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "12px",
    marginBottom: "0",
};

const buttonContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#E4B851",
    borderRadius: "9999px",
    color: "#000000",
    display: "inline-block",
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "100%",
    padding: "16px 32px",
    textDecoration: "none",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
};

const footer = {
    padding: "0 48px",
    textAlign: "center" as const,
};

const footerText = {
    color: "#6B5B8B",
    fontSize: "14px",
    lineHeight: "24px",
    marginBottom: "0",
};
