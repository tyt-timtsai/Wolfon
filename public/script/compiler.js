const { ace, axios } = window;
const field = document.getElementById('editor');
const language = document.getElementById('language');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const runBtn = document.getElementById('run-btn');
const terminal = document.getElementById('terminal');

// ============== ace 編輯器 ===============
const editor = ace.edit(field);
editor.setOptions({
  autoScrollEditorIntoView: true,
  copyWithEmptySelection: true,
});
editor.setTheme('ace/theme/twilight');
editor.session.setMode(`ace/mode/${language.value}`);
language.addEventListener('change', () => {
  console.log(editor.getValue());
  editor.session.setMode(`ace/mode/${language.value}`);
  switch (language.value) {
    case 'javascript':
      editor.session.setValue(`// ${language.value}\nconsole.log('Hello Javascript!')`);
      break;
    case 'python':
      editor.session.setValue(`# ${language.value}\nprint('Hello Python!')`);
      break;
    case 'golang':
      editor.session.setValue(`// ${language.value}\npackage main\nimport "fmt"\n\nfunc main(){\n    fmt.Println("Hello Golang!") \n}`);
      break;

    default:
      editor.session.setValue(`// ${language.value}`);
      break;
  }
});

// =============== 監聽事件 ================
searchBtn.addEventListener('click', () => {
  editor.find(search.value);
});

runBtn.addEventListener('click', () => {
  const data = {
    language: language.value,
    code: editor.getValue(),
  };
  axios.post('/api/v1/code', data)
    .then((res) => {
      console.log(res.data);
      terminal.innerHTML = res.data;
    })
    .catch((err) => console.log(err));
});
