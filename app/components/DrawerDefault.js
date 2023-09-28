"use client";

import React from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton, Tooltip, List, ListItem, ListItemPrefix, ListItemSuffix, Chip,
} from "@material-tailwind/react";
import {ChevronLeftIcon, FireIcon, MapPinIcon} from "@heroicons/react/24/solid";

export function DrawerDefault({handleLayerToggle}) {
    const [open, setOpen] = React.useState(false);

    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <React.Fragment>
            <Tooltip content="More layers" placement="left-end">
                <IconButton className="rounded-full" onClick={openDrawer} size="sm">
                    <ChevronLeftIcon className="h-4 w-4"/>
                </IconButton>
            </Tooltip>

            <Drawer open={open} onClose={closeDrawer} overlay={false} placement={"right"} className="p-1 bg-blend-soft-light">
                <Typography variant="h5" color="blue-gray">
                    Layers
                </Typography>
                <div className="mb-6 flex items-center justify-between">
                    {/*<Typography variant="h5" color="blue-gray">*/}
                    {/*    Material Tailwind*/}
                    {/*</Typography>*/}
                    <List className="p-0">
                        <ListItem
                            className="group rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                            onClick={() => handleLayerToggle('ColorRemap')}
                        >
                            <ListItemPrefix>
                                <FireIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            Temperature
                        </ListItem>
                        <ListItem
                            className="rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                            onClick={() => handleLayerToggle('mvtLayer')}
                        >
                            <ListItemPrefix>
                                <MapPinIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            Wind
                        </ListItem>
                        <ListItem
                            className="rounded-none py-1.5 px-3 text-sm font-normal text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                            onClick={() => handleLayerToggle('ColorRemap')}
                        >
                            <ListItemPrefix>
                                <FireIcon className="h-5 w-5"/>
                            </ListItemPrefix>
                            Fire
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </React.Fragment>
    );
}



