import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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
        iotGatewayCart,
        setIotGatewayCart,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    const handleCheck = (event) => {

        if (event?.target?.checked) {
            if (iotGatewayCart.length !== 0) {
                const index = iotGatewayCart.indexOf(absolutePath);
                if (index === -1) {
                    // La stringa non è presente nell'array, la aggiungo
                    setIotGatewayCart((prevData) => [...prevData, absolutePath]);
                }
            } else {
                setIotGatewayCart((prevData) => [...prevData, absolutePath]);
            }

        } else {
            if (iotGatewayCart.length !== 0) {
                const index = iotGatewayCart.indexOf(absolutePath);
                if (index !== -1) {
                    // La stringa è presente nell'array, la rimuovo
                    setIotGatewayCart((prevData) => prevData.filter((item) => item !== absolutePath));
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
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {(childTags && childTags !== 0) ? `tags:${childTags},` : ""} {(childNodes && childNodes !== 0) ? `nodes: ${childNodes}` : ""}
                    </Typography>
                    <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
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

const buildTree = (array) => {
    const tree = {};
    console.log(array)
    array.forEach((item) => {
        const parts = item.split('.');
        let currentNode = tree;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!currentNode[part]) {
                currentNode[part] = {};
            }

            currentNode = currentNode[part];
        }
    });

    const generateComponents = (data, label) => {
        return Object.keys(data).map((key) => {
            const hasChildren = Object.keys(data[key]).length > 0;
            const labelIcon = hasChildren ? FolderIcon : Label;

            return (
                <StyledTreeItem
                    key={key}
                    nodeId={label ? `${label}.${key}` : key}
                    labelText={key}
                    labelIcon={labelIcon}
                >
                    {generateComponents(data[key], label ? `${label}.${key}` : key)}
                </StyledTreeItem>
            );
        });
    };

    return generateComponents(tree, null);
};

export default function IconTreeView(props) {

    const { iotGatewayCart, setIotGatewayCart } = props
    console.log(iotGatewayCart)
    return (
        <TreeView
            aria-label="icon"
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            iotGatewayCart={iotGatewayCart}
            setIotGatewayCart={setIotGatewayCart}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'auto' }}
        >

            {buildTree(iotGatewayCart)}


        </TreeView>
    );
}