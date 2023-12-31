import { useEffect, useState } from 'react'
import {
    Container,
    Grid, GridItem,
    useDisclosure,
} from '@chakra-ui/react'
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    doc,
    deleteDoc,
} from 'firebase/firestore'
import { db } from './lib/firebase'
import Navbar from './components/Navbar'
import Drawer from './components/Drawer'
import CustomCard from './components/CustomCard'
import OrderDialog from './components/OrderDialog'
import MyOrder from './components/MyOrder'

const App = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOrder, onOpen: openDialog, onClose: closeDialog } = useDisclosure()
    const { isOpen: isOpenRent, onOpen: openRent, onClose: closeRent } = useDisclosure()
    const [cars, setCars] = useState(null)
    const [orders, setOrders] = useState([])
    const [selected, setSelected] = useState(null)
    const [isEdit, setIsEdit] = useState(false)

    const getCars = () => {
        onSnapshot(query(collection(db, "cars"), orderBy("created_date", "desc")), (snapshot) => setCars(snapshot.docs))
    }

    const getOrders = () => {
        onSnapshot(query(collection(db, "orders"), orderBy("order_date", "desc")), (snapshot) => setOrders(snapshot.docs))
    }

    const deleteCar = (id) => {
        const isDelete = confirm("Delete this car ?").valueOf()
        if (isDelete) {
            deleteDoc(doc(db, "cars", id))
        }
    }

    const editCar = (car) => {
        setSelected(car)
        setIsEdit(true)
        onOpen()
    }

    const rentNow = (car) => {
        setSelected(car)
        openDialog()
    }

    useEffect(() => {
        getCars()
        getOrders()
        localStorage.setItem("chakra-ui-color-mode", "dark")
    }, [])

    return (
        <Container py="10" maxW="container.xl">
            <Navbar onOpen={onOpen} openRent={openRent} orders={orders.length} />
            <Drawer
                isOpen={isOpen}
                onClose={() => {
                    setIsEdit(false)
                    onClose()
                }}
                isEdit={isEdit}
                car={selected}
            />
            <MyOrder isOpen={isOpenRent} onClose={closeRent} orders={orders} />
            <OrderDialog isOpen={isOrder} onClose={closeDialog} item={selected} />
            <Grid
                gap={4}
                templateColumns={{
                    base: "repeat(1, 1fr)",
                    lg: "repeat(auto-fit, minmax(410px, 1fr))"
                }}
            >
                {cars?.map(car => (
                    <GridItem
                        key={car.id}
                        w="100%"
                    >
                        <CustomCard
                            id={car.id}
                            item={car.data()}
                            onRentNow={rentNow}
                            deleteCar={deleteCar}
                            editCar={editCar}
                        />
                    </GridItem>
                ))}
            </Grid>
        </Container>
    );
};

export default App;