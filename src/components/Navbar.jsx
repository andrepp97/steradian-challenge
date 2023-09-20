import PropTypes from 'prop-types'
import { AddIcon, CopyIcon } from '@chakra-ui/icons'
import { Flex, Heading, Button } from '@chakra-ui/react'

const Navbar = ({ onOpen, openRent }) => {
    return (
        <Flex
            mb="10"
            alignItems="center"
            justifyContent="space-between"
        >
            <Heading size="md">
                STERADIAN CAR
            </Heading>
            <Flex gap={4}>
                <Button leftIcon={<AddIcon />} onClick={onOpen}>
                    New Car
                </Button>
                <Button leftIcon={<CopyIcon />} onClick={openRent}>
                    My Orders
                </Button>
            </Flex>
        </Flex>
    );
};

Navbar.propTypes = {
    onOpen: PropTypes.func,
    openRent: PropTypes.func,
}

export default Navbar;