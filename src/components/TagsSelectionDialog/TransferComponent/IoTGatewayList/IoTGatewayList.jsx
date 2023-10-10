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
        fullPath,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    const removeElementAndChildren = (element, array) => {
        const isChild = (child, parent) => {
            return child.startsWith(parent + ".");
        };

        const childrenToRemove = array.filter((child) => isChild(child, element));

        if (childrenToRemove.length > 0) {
            childrenToRemove.forEach((child) => {
                array.splice(array.indexOf(child, 1))
            });
        }
        if (array.indexOf(element) !== -1) {
            array.splice(array.indexOf(element))
        }


        return array;
    };

    const handleDelete = () => {
        const arrayWithItemRemoved = removeElementAndChildren(fullPath, iotGatewayCart)
        setIotGatewayCart(arrayWithItemRemoved)
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
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
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

const buildTree = (array, setIotGatewayCart) => {
    const shallowCopy = [...array]
    // Funzione ausiliaria per aggiungere un elemento all'albero
    const addToTree = (node, parts, fullPath) => {
        const part = parts[0];
        const currentPath = fullPath ? `${fullPath}.${part}` : part;

        if (!node[part]) {
            node[part] = {
                children: {},
                hasChildren: parts.length > 1,
                labelIcon: parts.length > 1 ? FolderIcon : Label,
                fullPath: currentPath, // Salva il percorso completo verso il nodo root
            };
        }

        if (parts.length > 1) {
            addToTree(node[part].children, parts.slice(1), currentPath);
        }
    };

    const tree = { children: {} };

    // Ordina l'array in modo che gli elementi più lunghi vengano prima
    array.sort((a, b) => b.length - a.length);

    array.forEach((item) => {
        const parts = item.split('.');
        addToTree(tree.children, parts);
    });

    const generateComponents = (data, label, fullPath) => {
        return Object.keys(data).map((key) => {
            const { children, hasChildren, labelIcon, fullPath: currentPath } = data[key];

            return (
                <StyledTreeItem
                    key={key}
                    nodeId={label ? `${label}.${key}` : key}
                    labelText={key}
                    labelIcon={labelIcon}
                    fullPath={currentPath}
                    iotGatewayCart={shallowCopy}
                    setIotGatewayCart={setIotGatewayCart}

                >
                    {hasChildren && generateComponents(children, label ? `${label}.${key}` : key, currentPath)}
                </StyledTreeItem>
            );
        });
    };

    return generateComponents(tree.children, null);
};

// Funzione per rimuovere i componenti considerati impliciti


export default function IconTreeView(props) {

    const { iotGatewayCart, setIotGatewayCart } = props

    return (
        <TreeView
            aria-label="icon"
            defaultExpanded={['3']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'auto' }}
        >

            {buildTree(iotGatewayCart, setIotGatewayCart)}


        </TreeView>
    );
}