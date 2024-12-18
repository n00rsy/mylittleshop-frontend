'use client';
import { IconBuildingStore, IconChevronDown, IconHome2, IconLogout, IconPlus, IconSettings } from '@tabler/icons-react';
import { Text, Stack, AppShell, Flex, Title, Burger, Group, Center, NavLink, Loader, Button, Container, Box, Avatar, Menu, rem, Anchor, JsonInput } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from '@/context/DashboardContext';
import { createStripeLoginLink, createStripeSession, isStripeAccountOnboarded, onboardStripeAccount, updateStripeAccount } from '@/actions/stripe';
import { useRouter } from 'next/navigation';
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
    ConnectPayments,
    ConnectComponentsProvider,
    ConnectAccountManagement,
} from "@stripe/react-connect-js";
export default function Home() {
    const { userData, setUserData, activeShopIndex } = useContext(DashboardContext)
    const activeShop = userData.shops[activeShopIndex]
    const router = useRouter()

    const [stripeOnboarded, setStripeOnboarded] = useState(true)

    useEffect(() => {
        async function getStripeOnboarded() {
            const isStripeOnboarded = await isStripeAccountOnboarded(userData.stripe.accountId)
            setStripeOnboarded(isStripeOnboarded)
            const stripeSecret = await createStripeSession(userData.stripe.accountId)
        }
        getStripeOnboarded()
    }, [])

    const handleeditstripe = async () => {
        console.log("requesting edit stripe...")
        const accountLink = await updateStripeAccount(userData.stripe.accountId)
        console.log(accountLink)
        if (accountLink) {
            router.push(accountLink)
        }
    }

    const handlefinshstripe = async () => {
        console.log("requesting finish stripe...")
        const accountLink = await onboardStripeAccount(userData.stripe.accountId)
        console.log(accountLink)
        router.push(accountLink)
    }

    const handlelaunchstripedashboard = async () => {
        const link = await createStripeLoginLink(userData.stripe.accountId)
        router.push(link)
    }

    return (
            // <ConnectPayments />
            // <ConnectAccountManagement />
        <Center style={{ height: '50vh' }}>
            <Container>
                <Stack>
                    <Button component="a" target="_blank" href={`/shop/${activeShop.url}`}>View My Shop</Button>
                    {(stripeOnboarded) ?
                        (<Button onClick={handleeditstripe}>Edit Stripe Details</Button>) :
                        (<Button onClick={handlefinshstripe}>Finish Stripe Details</Button>)
                    }
                    {stripeOnboarded && (
                        <Button onClick={handlelaunchstripedashboard}>Launch Stripe Dashboard</Button>
                    )}
                </Stack>
            </Container>
        </Center>
    );
}
