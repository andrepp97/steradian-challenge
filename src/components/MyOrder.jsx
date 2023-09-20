import { useRef } from 'react'
import PropTypes from 'prop-types'
import {
    Flex,
    Text,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import {
    doc,
    deleteDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import CustomCard from './CustomCard'

const MyOrder = ({ isOpen, onClose, orders }) => {
    const btnRef = useRef()

    const cancelOrder = (id) => {
        const isDelete = confirm("Cancel this order ?").valueOf()
        if (isDelete) {
            deleteDoc(doc(db, "orders", id))
        }
    }

    return (
        <Drawer
            size="lg"
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    My Orders
                </DrawerHeader>

                <DrawerBody>
                    <Flex direction="column" gap={6}>
                        {
                            orders?.length
                                ? orders.map(order => (
                                    <CustomCard
                                        key={order.id}
                                        id={order.id}
                                        item={order.data()}
                                        cancelOrder={cancelOrder}
                                        rented
                                    />
                                ))
                                : <Text>You haven&apos;t rented yet</Text>
                        }
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

MyOrder.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    orders: PropTypes.array || null,
}

export default MyOrder;