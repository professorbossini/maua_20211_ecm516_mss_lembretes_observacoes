const express = require ('express');
const axios = require ('axios');
const app = express();
app.use (express.json());

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.contador] = lembrete;
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes'] || [];
    observacoes.push(observacao);
    baseConsulta[observacao.lembreteId]['observacoes'] = observacoes;
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes'];
    
    const indice = observacoes.findIndex(o => o.id === observacao.id);
    observacoes[indice] = observacao;
  }
};

const baseConsulta = {};

app.get('/lembretes', (req, res) => {
  res.status(200).send(baseConsulta);
});

app.post('/eventos', (req, res) => {
  try{
    funcoes[req.body.tipo](req.body.dados);
  }catch (err){ }
  res.status(200).send(baseConsulta);
});

app.listen(6000, async () => {
  const resp = await axios.get('http://localhost:10000/eventos');
  resp.data.forEach(((valor, indice, colecao) => {
      try{
        funcoes[valor.tipo](valor.dados);
      }
      catch (err){ }
  }))
  console.log("Microsserviço consulta. Porta 6000.")

});