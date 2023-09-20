import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Box, Flex,
    Image, Input, Text,
    NumberInput, NumberInputField,
    Button, Drawer, DrawerBody,
    DrawerHeader, DrawerFooter,
    DrawerOverlay, DrawerContent,
    DrawerCloseButton, useToast,
} from '@chakra-ui/react'
import {
    doc,
    addDoc,
    updateDoc,
    collection,
    serverTimestamp,
} from "@firebase/firestore"
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "@firebase/storage"
import { db, storage } from "../lib/firebase"
import { thousandSeparator } from '../helper'

const CarDrawer = ({ isOpen, onClose, isEdit, car }) => {
    const toast = useToast()
    const btnRef = useRef()
    const [carImg, setCarImg] = useState()
    const [display, setDisplay] = useState('')
    const [carName, setCarName] = useState('')
    const [dayRate, setDayRate] = useState('')
    const [monthRate, setMonthRate] = useState('')
    const [loading, setLoading] = useState(false)

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setCarImg(event.target.files[0])
            setDisplay(URL.createObjectURL(event.target.files[0]))
        }
    }

    const resetInput = () => {
        setCarImg(null)
        setDisplay(null)
        setCarName('')
        setDayRate('')
        setMonthRate('')
    }

    const saveCar = async () => {
        try {
            setLoading(true)

            if (isEdit) {
                await updateDoc(doc(db, "cars", car?.id), {
                    car_name: carName,
                    day_rate: dayRate,
                    month_rate: monthRate,
                })
                toast({
                    title: 'Car Updated',
                    description: `${carName} successfully updated.`,
                    status: 'success',
                    position: 'top',
                    isClosable: true,
                    duration: 4000,
                })
                setLoading(false)
                resetInput()
                onClose()
            } else {
                const docRef = await addDoc(collection(db, "cars"), {
                    car_name: carName,
                    day_rate: dayRate,
                    month_rate: monthRate,
                    created_date: serverTimestamp(),
                })

                const imageRef = ref(storage, carName)

                uploadBytes(imageRef, carImg)
                    .then(async (snapshot) => {
                        const downloadURL = await getDownloadURL(snapshot.ref)
                        await updateDoc(doc(db, "cars", docRef.id), { image: downloadURL })
                        toast({
                            title: 'Car Created',
                            description: `${carName} successfully created.`,
                            status: 'success',
                            position: 'top',
                            isClosable: true,
                            duration: 4000,
                        })
                    })
                    .catch(err => console.log(err))
                    .finally(() => {
                        setLoading(false)
                        resetInput()
                        onClose()
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isSaveDisabled = () => {
        if (isEdit) return !carName || !dayRate || !monthRate
        return !carImg || !carName || !dayRate || !monthRate
    }

    useEffect(() => {
        if (isEdit && car) {
            console.log('Masuk Effect Edit')
            setDisplay(car.image)
            setCarName(car.car_name)
            setDayRate(car.day_rate)
            setMonthRate(car.month_rate)
        }
    }, [car, isEdit])

    return (
        <Drawer
            size="sm"
            isOpen={isOpen}
            placement='right'
            onClose={() => {
                resetInput()
                onClose()
            }}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    {isEdit ? "Edit" : "Add New"} Car
                </DrawerHeader>

                <DrawerBody>
                    <Flex direction="column" gap={6}>
                        <Box>
                            <Text>Car Image *</Text>
                            {display && (
                                <Image alt="preview" src={display} />
                            )}
                            {!isEdit && (
                                <Input
                                    p="1"
                                    type="file"
                                    accept="image/*"
                                    onChange={onImageChange}
                                />
                            )}
                        </Box>
                        <Box>
                            <Text>Car Name *</Text>
                            <Input
                                placeholder='Volkswagen'
                                value={carName}
                                onChange={e => setCarName(e.target.value)}
                            />
                        </Box>
                        <Box>
                            <Text>Daily Rate (Rp) *</Text>
                            <NumberInput
                                min={0}
                                value={thousandSeparator(dayRate)}
                                onChange={(valueString) => setDayRate(valueString)}
                            >
                                <NumberInputField placeholder='Rp 100.000' />
                            </NumberInput>
                        </Box>
                        <Box>
                            <Text>Monthly Rate (Rp) *</Text>
                            <NumberInput
                                min={0}
                                value={thousandSeparator(monthRate)}
                                onChange={(valueString) => setMonthRate(valueString)}
                            >
                                <NumberInputField placeholder='Rp 2.000.000' />
                            </NumberInput>
                        </Box>
                    </Flex>
                </DrawerBody>

                <DrawerFooter>
                    <Button
                        w="full"
                        colorScheme="teal"
                        onClick={saveCar}
                        isLoading={loading}
                        isDisabled={isSaveDisabled()}
                    >
                        SAVE
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

CarDrawer.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    isEdit: PropTypes.bool,
    car: PropTypes.any,
}

export default CarDrawer;