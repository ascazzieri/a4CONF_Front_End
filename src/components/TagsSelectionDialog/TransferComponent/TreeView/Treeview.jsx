import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Label from '@mui/icons-material/Label';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        paddingLeft: theme.spacing(2),
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props) {
    const theme = useTheme();
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        childTags,
        childNodes,
        absolutePath,
        labelText,
        colorForDarkMode,
        bgColorForDarkMode,
        channelCart,
        setChannelCart,
        ...other
    } = props;
    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    const handleCheck = (event) => {

        if (event?.target?.checked) {
            if (channelCart.length !== 0) {
                const index = channelCart.indexOf(absolutePath);
                if (index === -1) {
                    // La stringa non è presente nell'array, la aggiungo
                    setChannelCart((prevData) => [...prevData, absolutePath]);
                }
            } else {
                setChannelCart((prevData) => [...prevData, absolutePath]);
            }

        } else {
            if (channelCart.length !== 0) {
                const index = channelCart.indexOf(absolutePath);
                if (index !== -1) {
                    // La stringa è presente nell'array, la rimuovo
                    setChannelCart((prevData) => prevData.filter((item) => item !== absolutePath));
                }
            }
        }
    }
    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0,
                    }}
                >
                    <Checkbox sx={{ mr: 1 }} size="small" onChange={handleCheck} name={labelText} />
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {(childTags && childTags !== 0) ? `tags:${childTags},` : ""} {(childNodes && childNodes !== 0) ? `nodes: ${childNodes}` : ""}
                    </Typography>
                </Box>
            }
            style={styleProps}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    bgColorForDarkMode: PropTypes.string,
    color: PropTypes.string,
    colorForDarkMode: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const createStyledTreeItems = (data, parentPath, channelCart, setChannelCart) => {
    const renderTreeItems = (data, parentPath) => {
        return Object.keys(data).map((key) => {
            // If the item has "tags" property, it's a leaf node with no more nested items
            if (key === 'tags') {
                return Object.keys(data.tags).map((insideKey, insideIndex) => {
                    const currentPath = parentPath ? `${parentPath}.${insideKey}` : insideKey;
                    return (
                        <StyledTreeItem
                            key={key + insideKey}
                            nodeId={key + insideKey}
                            labelText={insideKey}
                            labelIcon={Label} // Replace with the appropriate icon based on your data
                            absolutePath={currentPath}
                            channelCart={channelCart}
                            setChannelCart={setChannelCart}
                        />
                    )
                }
                );
            }

            // If the item has "groups" property, it's a parent node with nested items
            if (key === 'groups') {
                return Object.keys(data.groups).map((insideKey, insideIndex) => {
                    const currentPath = parentPath ? `${parentPath}.${insideKey}` : insideKey;
                    const numChildTags = Object.keys(data.groups[insideKey]?.tags).length
                    const numChildNodes = Object.keys(data.groups[insideKey]?.groups).length
                    return (
                        <StyledTreeItem
                            key={key + insideKey}
                            nodeId={key + insideKey}
                            labelText={insideKey}
                            labelIcon={FolderIcon} // Replace with the appropriate icon based on your data
                            childTags={numChildTags}
                            childNodes={numChildNodes}
                            absolutePath={currentPath}
                            channelCart={channelCart}
                            setChannelCart={setChannelCart}
                        >
                            {renderTreeItems(data.groups[insideKey], currentPath)} {/* Recursive call */}
                        </StyledTreeItem>)
                })
            }



            // Handle other cases if necessary

            return null;
        });
    };

    if (data && Object.keys(data).length !== 0) {
        return renderTreeItems(data);
    }

    return null;
};


export default function IconTreeView(props) {

    const { tags, channelCart, setChannelCart } = props
    return (
        <TreeView
            aria-label="icon"
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'auto' }}
        >

            {createStyledTreeItems(tags, '', channelCart, setChannelCart)}


        </TreeView>
    );
}