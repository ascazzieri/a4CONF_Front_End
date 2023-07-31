import { Transfer, Tree, Input, Card } from 'antd';
import React, { useEffect, useState, useReducer } from 'react';
import { Button } from "@mui/material"

const { Search } = Input;




// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys),
    }));
const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {

    const transferDataSource = [];
    function flatten(list = []) {
        list.forEach((item) => {
            transferDataSource.push(item);
            flatten(item.children);
        });
    }
    flatten(dataSource);
    return (
        <Transfer
            {...restProps}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            render={(item) => item.key}
            showSelectAll={true}
            showSearch={true}


        >
            {({ direction, onItemSelect, selectedKeys }) => {
                if (direction === 'left') {
                    const checkedKeys = [...selectedKeys, ...targetKeys];
                    return (
                        <Tree
                            draggable={false}
                            checkable
                            checkedKeys={checkedKeys}
                            treeData={generateTree(dataSource, targetKeys)}
                            onCheck={(_, { node: { key } }) => {
                                onItemSelect(key, !isChecked(checkedKeys, key));
                            }}

                        />
                    );
                }
            }}
        </Transfer>
    );
};


const messageReducer = (state, action) => {
    if (action.type === 'PARENT_ALREADY_PRESENT') {
        return { isTransferAlert: true, isTransferAlertMessage: `${action.removedTag} because there was already a related parent of it, founded: ${action.relatedParent}'`, TransferAlertColor: { color: 'orange' } }
    } else {
        return { isTransferAlert: false, isTransferAlertMessage: '', TransferAlertColor: 'black' }
    }

}



const ManageTags = (props) => {
    const selectedChannelID = 'Device prova'
    const [targetKeys, setTargetKeys] = useState([]);
    const [addRemoveButton, setAddRemoveButton] = useState(false)
    const [TagsMessages, dispatchTagsMessages] = useReducer(messageReducer, { isTransferAlert: false, isTransferAlertMessage: '', TransferAlertColor: { color: 'black' } })
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)

    const [tagsAlreadySaved, setTagsAlreadySaved] = useState();
    const [tagsMatches, setTagsMatches] = useState([])
    const [searchValue, setSearchValue] = useState('')

    const onChange = (key) => {
        setTargetKeys(key);
    };
    useEffect(() => {

        if (targetKeys.length !== 0) {
            let showRemovedTags = [];
            setIsButtonDisabled(false)

            for (let i = 0; i < targetKeys.length; i++) {
                let newString = targetKeys[i];
                let newStringLength = newString.length;
                for (let k = 0; k < targetKeys.length; k++) {
                    if (targetKeys[k] === targetKeys[i]) {
                        /*           console.log('Stesso array=> ' + targetKeys[k] + ' : ' + targetKeys[i]) */
                        continue;

                    }
                    let checkedString = targetKeys[k];
                    let checkedPortion = checkedString.substring(0, newStringLength);
                    /*                  console.log('New String: ' + newString + ', checkedPortion: ' + checkedPortion) */
                    if (checkedPortion === newString) {

                        /*                  console.log('Aggiungo il virus di autodistruzione in : ' + targetKeys[k]); */

                        targetKeys[k] += ' has been removed '
                        showRemovedTags.push(targetKeys[k])
                        console.log(showRemovedTags)
                        setAddRemoveButton(!addRemoveButton)
                        dispatchTagsMessages({ type: 'PARENT_ALREADY_PRESENT', removedTag: showRemovedTags, relatedParent: targetKeys[i] })

                    }

                }
                targetKeys.map((item, index) => {
                    if (item.includes(' has been removed ')) {
                        targetKeys.splice(index, 1)
                    }
                })
            }
            setTargetKeys(targetKeys)
        } else if (targetKeys.length === 0) {
            setIsButtonDisabled(true)
        }


    }, [targetKeys, addRemoveButton])









    const [treeData, setTreeData] = useState([]);
    const [showTags, setShowTags] = useState()

    /*     useEffect(() => {
            (async () => {
    
                const updateTags = await get_tags(selectedChannelID);
                await setShowTags(updateTags[`${selectedChannelID}`]["tags"])
                const myTreeData = await createTreeData(updateTags[`${selectedChannelID}`]["tags"])
                await setTreeData(myTreeData)
            })()
    
    
        }, []) */

    const readAlreadySavedTags = (data) => {

        if (data !== null && data !== undefined) {
            let trueTags = [];
            Object.keys(data).map((item, index) => {
                if (data[`${item}`] === true) {
                    trueTags.push(item)


                }
            })
            setTagsAlreadySaved(trueTags)
        }

    }

    const createTreeData = (data) => {
        let mapper = {}
        let root = { children: [] };
        readAlreadySavedTags(data)

        for (const str of Object.keys(data)) {
            let splits = str.split('.'),
                key = '';

            splits.reduce((parent, title, i) => {
                key += `${title}.`;

                if (!mapper[key]) {
                    const o = { title, key };
                    mapper[key] = o; // set the new object with unique path
                    parent.children = parent.children || [];
                    parent.children.push(o)
                }

                return mapper[key];
            }, root)
        }

        return root.children
    }


    const sendTagsList = () => {

        let importedTags = showTags;
        /*  console.log(importedTags) */
        let counterSaved = 0

        for (const key of Object.keys(importedTags)) {//Ciclo fra le key dell'oggetto
            if (targetKeys.length === 0) {
                importedTags[key] = false
            } else {
                keyloop:
                for (let i = 0; i < targetKeys.length; i++) {

                    for (let k = 0; k < key.split('.').length; k++) {//Ciclo all'interno dell'array costituito dalla singola key
                        let checkedKeyObject = '';
                        if (k === 0) {
                            checkedKeyObject = key.split('.')[k];
                        }
                        if (k > 0) {
                            for (let j = 0; j < k; j++) {//Aggiungo i pezzi precedenti dell'array
                                checkedKeyObject += `${key.split('.')[j]}.`
                            }
                            checkedKeyObject += `${key.split('.')[k]}`
                        }
                        /*           console.log(targetKeys[i].substring(0, targetKeys[i].length - 1), checkedKeyObject) */
                        if (targetKeys[i].substring(0, targetKeys[i].length - 1) === checkedKeyObject) {
                            importedTags[key] = true
                            break keyloop;
                        } else if (targetKeys[i].substring(0, targetKeys[i].length - 1) !== checkedKeyObject) {
                            importedTags[key] = false
                        }

                    }
                }
            }


        }

        let tagStructure = {}
        tagStructure["tags_file_name"] = `opcua_${selectedChannelID.toLowerCase()}_tags.json`;
        tagStructure["tags"] = importedTags;
        console.log('mando i dati')
        //sendTags(selectedChannelID, tagStructure)
        readAlreadySavedTags(tagStructure["tags"])
        return importedTags
    }


    const search = (value) => {

        const lowerCaseValue = value.toLowerCase();
        if (tagsAlreadySaved !== undefined) {
            setTagsMatches(tagsAlreadySaved.filter(string => string.toLowerCase().indexOf(lowerCaseValue) !== -1));
        }



        // mostra a utente i risultati della ricerca (matches
    }

    const searchOnChange = (event) => {
        setSearchValue(event.target.value)
        search(event.target.value)

    }




    return (
        <>
            {TagsMessages.isTransferAlert && <p style={TagsMessages.TransferAlertColor}>{TagsMessages.isTransferAlertMessage}</p>}
            <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />
            <Button
                onClick={sendTagsList}
                type="button"
            /* disabled={isButtonDisabled} */
            >
                {isButtonDisabled === true ? <>Clear tags</> : <>Save tags</>}
            </Button>


            {/* <h5>Tags already saved in channel: {tagsAlreadySaved !== undefined ? <>{tagsAlreadySaved.length}</> : <>0</>}</h5>
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={search}
                value={searchValue}
                onChange={searchOnChange}
            />

            <Card style={{ marginTop: 20 }}>

                {searchValue === '' || searchValue === undefined ? (
                    tagsAlreadySaved !== undefined ? (
                        tagsAlreadySaved.map((item, index) => <p key={item}>{item}</p>)
                    ) : <p></p>
                ) : (
                    tagsAlreadySaved !== undefined ? (
                        tagsMatches.map((item, index) => <p key={item}>{item}</p>)
                    ) : <p></p>
                )}
            </Card> */}

        </>


    )

};
export default ManageTags;