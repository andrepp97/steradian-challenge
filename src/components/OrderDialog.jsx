import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Box, Stack,
    Input, Text,
    Button, AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useToast,
} from '@chakra-ui/react'
import {
    addDoc,
    collection,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const OrderDialog = ({ isOpen, onClose, item }) => {
    const toast = useToast()
    const cancelRef = useRef()
    const [date, setDate] = useState('')
    const [dropDate, setDropDate] = useState('')
    const [location, setLocation] = useState('')
    const [dropLocation, setDropLocation] = useState('')
    const [loading, setLoading] = useState(false)

    const resetInput = () => {
        setDate('')
        setDropDate('')
        setLocation('')
        setDropLocation('')
    }

    const onOrder = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "orders"), {
                car_id: item?.id,
                car: item,
                order_date: serverTimestamp(),
                pickup_date: date,
                dropoff_date: dropDate,
                pickup_location: location,
                dropoff_location: dropLocation,
            })

            toast({
                title: 'Order Created',
                description: `You ordered ${item?.car_name} for a rent.`,
                status: 'success',
                position: 'top',
                isClosable: true,
                duration: 4000,
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            resetInput()
            onClose()
        }
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={() => {
                resetInput()
                onClose()
            }}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>
                    Rent Details
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    <Stack gap={6}>
                        <Box>
                            <Text>Car</Text>
                            <Input
                                isReadOnly
                                value={item?.car_name}
                            />
                        </Box>
                        <Box>
                            <Text>Pickup Date *</Text>
                            <Input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={e => {
                                    setDate(e.target.value)
                                    setDropDate(e.target.value)
                                }}
                            />
                        </Box>
                        <Box>
                            <Text>Dropoff Date *</Text>
                            <Input
                                type="date"
                                value={dropDate}
                                min={date ? new Date(date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                                onChange={e => setDropDate(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text>Pickup Location *</Text>
                            <Input
                                value={location}
                                placeholder={`Your Pickup location`}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text>Dropoff Location *</Text>
                            <Input
                                value={dropLocation}
                                placeholder={`Your Dropoff location`}
                                onChange={e => setDropLocation(e.target.value)}
                            />
                        </Box>
                    </Stack>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button
                        colorScheme='teal'
                        onClick={onOrder}
                        isLoading={loading}
                        isDisabled={!date || !location}
                    >
                        Order
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

OrderDialog.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    item: PropTypes.object,
}

export default OrderDialog;