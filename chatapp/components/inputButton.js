class InputButton{
    constructor(text,type){
        this.$button = document.createElement("button");
        this.$button.setAttribute("class","bg-yellow-300 hover:bg-yellow-400 px-8 py-2 text-gray-700 font-bold rounded-lg")
        this.$button.innerText = text;
        this.$button.type = type;
    }
    render(){
        return this.$button;
    }
}

export default InputButton;