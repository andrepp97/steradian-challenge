import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
    Box, Stack,
    Input, Text,
    Radio, RadioGroup,
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
    const [type, setType] = useState('pickup')
    const [date, setDate] = useState('')
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)

    const resetInput = () => {
        setDate('')
        setLocation('')
        setType('pickup')
    }

    const onOrder = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "orders"), {
                car_id: item?.id,
                car: item,
                order_date: serverTimestamp(),
                pickup_date: type == 'pickup' ? date : '',
                dropoff_date: type == 'dropoff' ? date : '',
                pickup_location: type == 'pickup' ? location : '',
                dropoff_location: type == 'dropoff' ? location : '',
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
                        <RadioGroup onChange={setType} value={type}>
                            <Stack direction='row' gap={4}>
                                <Radio value='pickup'>Pick Up</Radio>
                                <Radio value='dropoff'>Drop Off</Radio>
                            </Stack>
                        </RadioGroup>
                        <Box>
                            <Text>{type == 'pickup' ? 'Pick Up' : 'Drop Off'} Date *</Text>
                            <Input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                placeholder={`Your ${type} date`}
                                onChange={e => setDate(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text>{type == 'pickup' ? 'Pick Up' : 'Drop Off'} Location *</Text>
                            <Input
                                placeholder={`Your ${type} location`}
                                onChange={e => setLocation(e.target.value)}
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