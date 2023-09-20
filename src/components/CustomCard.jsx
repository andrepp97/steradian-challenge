import PropTypes from 'prop-types'
import {
    Stack, Button,
    Heading, Text,
    Flex, Box, Image, Card,
    CardBody, CardFooter,
} from '@chakra-ui/react'
import { TimeIcon, CalendarIcon, DeleteIcon } from '@chakra-ui/icons'
import { thousandSeparator } from '../helper'

const CustomCard = ({ id, item, onRentNow, deleteCar, cancelOrder, rented }) => {
    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            bg="gray.700"
        >
            <Image
                src={rented ? item?.car.image : item?.image}
                alt={rented ? item?.car?.car_name : item?.car_name}
                objectFit="contain"
                objectPosition="center"
                maxW={{ base: '100%', sm: '275px' }}
            />

            <Stack>
                <CardBody pb={0}>
                    <Heading size="md">
                        {rented ? item?.car?.car_name : item?.car_name}
                    </Heading>
                    <br />
                    <Flex gap={6} wrap="wrap">
                        <Box>
                            <Flex alignItems="center" gap={2}>
                                <TimeIcon />
                                <Text fontWeight="thin">Daily</Text>
                            </Flex>
                            <Text fontWeight="semibold">
                                Rp {thousandSeparator(rented ? item?.car?.day_rate : item?.day_rate)}
                            </Text>
                        </Box>
                        <Box>
                            <Flex alignItems="center" gap={2}>
                                <CalendarIcon />
                                <Text fontWeight="thin">Monthly</Text>
                            </Flex>
                            <Text fontWeight="semibold">
                                Rp {thousandSeparator(rented ? item?.car?.month_rate : item?.month_rate)}
                            </Text>
                        </Box>
                    </Flex>
                </CardBody>

                <CardFooter gap={2}>
                    {!rented && (
                        <Button colorScheme='red' onClick={() => deleteCar(id)}>
                            <DeleteIcon />
                        </Button>
                    )}
                    <Button
                        w="full"
                        variant='solid'
                        colorScheme={rented ? 'red' : 'teal'}
                        onClick={rented ? () => cancelOrder(id) : () => onRentNow({ ...item, id })}
                    >
                        {rented ? 'Cancel Order' : 'Rent Now'}
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
    deleteCar: PropTypes.func || PropTypes.any,
    cancelOrder: PropTypes.func || PropTypes.any,
    rented: PropTypes.bool,
}

export default CustomCard;