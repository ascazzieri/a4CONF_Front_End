import { JSONEditor } from 'react-json-editor-viewer';

constructor(){
    this.onJsonChange = this.onJsonChange.bind(this);
}

onJsonChange(key, value, parent, data){
    console.log(key, value, parent, data);
}

<JSONEditor
    data={{
        the: "men",
        that: "landed",
        on: "the",
        moon: "were",
        maybe: 2,
        i: "think",
        probably: ["neil armstrong", "buzz aldrin"],
        am_i_right: true
    }}
    collapsible
    onChange={this.onJsonChange}
/>