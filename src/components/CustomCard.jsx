import PropTypes from 'prop-types'
import moment from 'moment'
import {
    Divider,
    Stack, Button,
    Heading, Text,
    Flex, Box, Image, Card,
    CardBody, CardFooter,
    Menu, MenuButton,
    MenuList, MenuItem,
} from '@chakra-ui/react'
import {
    TimeIcon,
    CalendarIcon,
    TriangleDownIcon,
    ExternalLinkIcon,
    RepeatClockIcon,
    EditIcon,
    DeleteIcon,
    ChevronDownIcon,
} from '@chakra-ui/icons'
import { thousandSeparator } from '../helper'

const dateFormat = (date) => moment(date).format("DD MMM YYYY")

const CustomCard = ({ id, item, onRentNow, deleteCar, editCar, cancelOrder, rented }) => {
    return (
        <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            bg="gray.700"
        >
            {!rented ? (
                <Menu>
                    <MenuButton
                        as={Button}
                        variant="ghost"
                        position="absolute"
                        right={0}
                        p={0}
                    >
                        <ChevronDownIcon />
                    </MenuButton>
                    <MenuList w="fit-content">
                        <MenuItem onClick={() => editCar({ ...item, id })}>
                            <EditIcon color="blue.300" mr={2} /> Edit
                        </MenuItem>
                        <MenuItem onClick={() => deleteCar(id)}>
                            <DeleteIcon color="red.300" mr={2} /> Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            ) : null}

            <Image
                src={rented ? item?.car.image : item?.image}
                alt={rented ? item?.car?.car_name : item?.car_name}
                p={2}
                objectFit="contain"
                objectPosition="center"
                maxW={{ base: "100%", sm: "275px" }}
            />

            <Stack w="full">
                <CardBody pb={0}>
                    <Heading size="md" mb={4}>
                        {rented ? item?.car?.car_name : item?.car_name}
                    </Heading>
                    <Flex gap={6} wrap="wrap">
                        <Box>
                            <Flex alignItems="center" gap={2}>
                                <TimeIcon />
                                <Text fontWeight="thin" color="whiteAlpha.800">Daily</Text>
                            </Flex>
                            <Text fontWeight="semibold">
                                Rp {thousandSeparator(rented ? item?.car?.day_rate : item?.day_rate)}
                            </Text>
                        </Box>
                        <Box>
                            <Flex alignItems="center" gap={2}>
                                <CalendarIcon />
                                <Text fontWeight="thin" color="whiteAlpha.800">Monthly</Text>
                            </Flex>
                            <Text fontWeight="semibold">
                                Rp {thousandSeparator(rented ? item?.car?.month_rate : item?.month_rate)}
                            </Text>
                        </Box>
                    </Flex>
                    {rented ? (
                        <>
                            <Divider mt={2} />
                            <Flex gap={3} direction="column" mt={3}>
                                <Box>
                                    <Flex alignItems="center" gap={2}>
                                        <RepeatClockIcon />
                                        <Text fontWeight="thin" color="whiteAlpha.800">
                                            Order Date
                                        </Text>
                                    </Flex>
                                    <Text fontWeight="semibold">
                                        {dateFormat(item?.order_date?.toDate())}
                                    </Text>
                                </Box>
                                <Box>
                                    <Flex alignItems="center" gap={2}>
                                        <ExternalLinkIcon />
                                        <Text fontWeight="thin" color="whiteAlpha.800">
                                            {item?.pickup_date ? "Pick Up" : "Drop Off"} Date
                                        </Text>
                                    </Flex>
                                    <Text fontWeight="semibold">
                                        {item?.pickup_date ? dateFormat(item.pickup_date) : dateFormat(item.dropoff_date)}
                                    </Text>
                                </Box>
                                <Box>
                                    <Flex alignItems="center" gap={2}>
                                        <TriangleDownIcon />
                                        <Text fontWeight="thin" color="whiteAlpha.800">
                                            {item?.pickup_location ? "Pick Up" : "Drop Off"} Location
                                        </Text>
                                    </Flex>
                                    <Text fontWeight="semibold">
                                        {item?.pickup_location ? item.pickup_location : item.dropoff_location}
                                    </Text>
                                </Box>
                            </Flex>
                        </>
                    ) : null}
                </CardBody>

                <CardFooter gap={2}>
                    <Button
                        w="full"
                        variant="solid"
                        colorScheme={rented ? "red" : "teal"}
                        onClick={rented ? () => cancelOrder(id) : () => onRentNow({ ...item, id })}
                    >
                        {rented ? "Cancel Order" : "Rent Now"}
                    </Button>
                </CardFooter>
            </Stack>
        </Card>
    );
};

CustomCard.propTypes = {
    id: PropTypes.string,
    item: PropTypes.object,
    onRentNow: PropTypes.func,
    editCar: PropTypes.func || PropTypes.any,
    deleteCar: PropTypes.func || PropTypes.any,
    cancelOrder: PropTypes.func || PropTypes.any,
    rented: PropTypes.bool,
}

export default CustomCard;