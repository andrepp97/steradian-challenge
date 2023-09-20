import PropTypes from 'prop-types'
import { AddIcon, CopyIcon } from '@chakra-ui/icons'
import { Flex, Heading, Button, Badge } from '@chakra-ui/react'

const Navbar = ({ onOpen, openRent, orders }) => {
    return (
        <Flex
            mb="10"
            gap={4}
            wrap="wrap"
            alignItems="center"
            justifyContent="space-between"
        >
            <Heading size="md">
                STERADIAN CARS
            </Heading>
            <Flex gap={4}>
                <Button leftIcon={<AddIcon />} onClick={onOpen}>
                    New Car
                </Button>
                <Button leftIcon={<CopyIcon />} onClick={openRent}>
                    My Orders
                    {orders > 0 && (
                        <Badge
                            w="4"
                            h="4"
                            top="0"
                            right="0"
                            position="absolute"
                            colorScheme="teal"
                            rounded="base"
                        >
                            {orders}
                        </Badge>
                    )}
                </Button>
            </Flex>
        </Flex>
    );
};

Navbar.propTypes = {
    orders: PropTypes.number,
    onOpen: PropTypes.func,
    openRent: PropTypes.func,
}

export default Navbar;