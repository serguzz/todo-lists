
// component 'todo-item'

  Vue.component('todo-item',{
    props: ['data'],
    data() {
      return {

      }
    },

    methods: {
      removeTodoItem(){
        this.$emit('remove_todo_item')
      },
      checkTodoItem(){
        this.$emit('check_todo_item')
      }
    },

    template: `
    <div class="task">
      <div class="col-10">

        <h3 class="task__title" v-bind:class="{isDone: data.isDone === true}">{{data.value}}</h3>
      </div>

      <div class="col">
        <button class="todo-item-btn" @click="checkTodoItem()">✔️</button>
      </div>
      <div class="col">
        <button class="todo-item-btn" @click="removeTodoItem()">❌</button>
      </div>
    </div>`
  });

  

  // Vue application

  const vue = new Vue({
    el: '#app',

    data: {

      //newTodoItems - helpful array for storing new added todo items to lists
      // this vue model is connected to inputs of new TODO Items in each TODO Note
      newTodoItems: [],

      // keeps current Note Index (for deleting)
      currentNoteIndex: 0,

      //initial sample values of TODO Notes
      todoLists: [
          [          
              { 
                value: '1.1 Implement Calculator App',
                isDone: true,
              },
              {
                value: '1.2 Read a book "Vue.js in action',
                isDone: false,
              },
              { 
                value: '1.3 Learn Nest.js',
                isDone: false,
              },
          ],
          [          
              { 
                value:  '2.1 Implement a web store',
                isDone: false,
              },
              { 
                value:  '2.2 Read "Thinking Java" ',
                isDone: false,
              },
              { 
                value:  '2.3 Read "Gang of Four" ',
                isDone: false,
              }
          ]
      ],

      // variable for storing back-up array of all TODO Notes 
      todoListsBackup: [],

      // variable for storing a file when uploading the Notes from a file on a disk
      file: null,

    },

    methods: {

      setCurrentNote(listIndex){
        this.currentNoteIndex = listIndex;
        //console.log("current listIndex is " + this.currentNoteIndex);
      },
      // returns the number of NOT DONE tasks in the todoList
      countOpenTasks (listIndex){
          
          let i = 0;
          for (todoItem of this.todoLists[listIndex]) {
            if (!todoItem.isDone) {
              i++;
            }
          }
          return i;
      },

      // adds new TODO Item from the related input to the TODO Note
      addTodoItem(listIndex) {
        if (this.newTodoItems[listIndex].length > 0) {
          this.todoLists[listIndex].push({
            value: this.newTodoItems[listIndex],
            isDone: false
          });
          this.newTodoItems[listIndex] = '';
        }
      },

      // removes a TODO Note from the todoLists array
      removeTodoNote(listIndex){
          this.todoListsBackup = this.todoLists.slice();
          this.todoLists.splice(listIndex, 1);
      },

      //
      removeCurrentNote(){
        this.removeTodoNote(this.currentNoteIndex);
        this.currentNoteIndex--;
      },

      // removes a TODO Item from the todoLists array 
      removeTodoItem(listIndex, itemIndex){
          this.todoListsBackup = this.todoLists;
          this.todoLists[listIndex].splice(itemIndex , 1);
      },

      // marks a TODO Item as done/not done - uses Boolean field  ".isDone"
      checkTodoItem(listIndex, itemIndex){
          this.todoLists[listIndex][itemIndex].isDone = !this.todoLists[listIndex][itemIndex].isDone;
      },

      // pushed new empty TODO Note to the end of the todoLists array
      addTodoNote() {
          this.todoListsBackup = this.todoLists.slice();
          this.todoLists.push([]);
      },

      // cancels last action - uses backup variable "todoListsBackup"
      undoLastAction(){
          if (this.todoListsBackup.length > 0) {
              this.todoLists = this.todoListsBackup.slice();
          }
      },

      // set the file variable in Vue app to the value given in "input file" tag
      setFileVariable : function(event){
          if(event){
              const fileForImport = event.srcElement.files[0];
              // set the file variable in our Vue application
              this.file = fileForImport;
          }
      },
      
      importNotesFromFile() {

        console.log('uploading Notes from a file ...');
        const fileReader = new FileReader();

        // here we use arrow function to have appropriate context
        fileReader.onload = (event) => {
            let contents = event.target.result;
            let jsonObj = JSON.parse(contents);
            this.todoLists = jsonObj.slice();
        }

        // here context is not critical
        fileReader.onerror = function(event) {
            console.error("Файл не может быть прочитан! код " + event.target.error.code);
        }

        // if file variable is not NULL
        if (this.file) {
            fileReader.readAsText(this.file);
        }
      },
      

      // saves (downloads) all todo notes to a file 'todo_notes.json' in DownLoads folder 
      exportNotesToFile() {

        const data = JSON.stringify(this.todoLists);
        const file = new Blob([data], {type: 'application/json'});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, 'todo_notes.json');
        else { // Others
            const a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'todo_notes.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
      }
    }
  })