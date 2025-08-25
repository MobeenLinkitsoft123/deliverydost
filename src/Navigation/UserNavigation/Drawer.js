import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';

const Drawer = createDrawerNavigator();
import {
    Home,
    Search,
    Post,
    Notification,
    Profile
} from '../../Screens';

function MyDrawer() {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{headerShown:false}} >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Search" component={Search} />
        </Drawer.Navigator>
    );
}

export default MyDrawer