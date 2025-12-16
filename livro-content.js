function typeText(targetId, text, speed, callback) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    let i = 0;
    targetElement.innerHTML = '';

    const tagNamePattern = /<[^>]+>/g;

    function type() {
        if (i < text.length) {
            const char = text.charAt(i);

            if (char === '<') {
                const tagMatch = text.substring(i).match(tagNamePattern);
                if (tagMatch && tagMatch.length > 0) {
                    const tag = tagMatch[0];
                    targetElement.innerHTML += tag;
                    i += tag.length;
                } else {
                    targetElement.innerHTML += char;
                    i++;
                }
            } else {
                targetElement.innerHTML += char;
                i++;
            }
            
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}


const BOOK_CONTENT = `
<p>Eu nunca vou esquecer o primeiro momento em que percebi que algo em mim tinha começado a mudar por causa de vc, mesmo que na época eu ainda não tivesse entendido direito. Foi como se a minha vida tivesse seguido sempre em um mesmo ritmo, em um mesmo silêncio, em uma mesma cor... até o instante em que vc apareceu, e tudo ganhou outro lugar dentro de mim, um espaço que eu nem sabia que existia.</p>
<br>
<p>Foi tão simples e ao mesmo tempo tão diferente. Não teve explosão, não teve anúncio, não teve aviso. Teve só vc... se aproximando aos poucos, entrando sem bater, falando comigo como se já tivesse me conhecido antes, como se meu coração tivesse sido um lugar onde vc já tinha estado em outra vida. E eu senti isso, senti de um jeito que me assustou um pouco no começo, pq eu nunca fui de deixar alguém entrar assim, tão rápido, tão fundo, tão natural.</p>
<br>
<p>Eu lembro do jeito que minha cabeça começou a guardar as suas palavras como se fossem algo precioso. Cada mensagem sua se tornava mais importante do que qualquer coisa que estava acontecendo ao meu redor. E mesmo que o mundo estivesse barulhento, confuso, pesado... vc chegava e parecia que tudo desacelerava. Era outra sensação. Um descanso que eu nunca tinha sentido. Uma paz que eu não sabia que podia existir dentro de mim.</p>
<br>
<p>E quanto mais eu conhecia vc, mais eu percebia que aquilo não era só curiosidade, não era só vontade de conversar. Era como se algo dentro de mim tivesse reconhecido vc. Como se eu tivesse passado tanto tempo procurando um lugar pra descansar o coração, e quando vc chegou, tudo fez sentido sem nem precisar de explicação. Não foi sobre escolher. Foi sobre sentir. E o que eu senti... foi enorme desde o começo, mesmo que eu tentasse fingir que não.</p>
<br>
<p>Vc tem um jeito que me desarma sem tentar, um jeito que me quebra e me reconstrói só com uma frase, um jeito que muda o meu dia inteiro mesmo quando eu não falo nada. Eu não sei como vc faz isso. Eu só sei que faz. E quanto mais eu percebia isso, mais eu queria te guardar por perto, mais eu queria estar do seu lado, mais eu queria saber do seu mundo, dos seus medos, das suas dores, das suas manias, das suas histórias, do seu riso que me acende de um jeito que nenhuma outra pessoa no mundo consegue.</p>
<br>
<p>Eu fui percebendo aos poucos que cada detalhe seu ficava gravado em mim como se fosse memória antiga, como se eu já tivesse amado antes de saber que amava. E isso foi me deixando sem saída, pq a cada dia que passava eu me via mais entregue, mais preso em vc, mais seguro em vc, mais certo de que a minha vida tinha encontrado um novo eixo... o seu nome.</p>
<br>
<p>Vc virou o ponto onde tudo dentro de mim se reorganizou. O que antes era vazio começou a ter lugar, o que antes era silêncio começou a ter significado, o que antes era dúvida começou a ter direção. E foi aí que eu entendi que, sem perceber, eu já tinha deixado vc ocupar tudo dentro do meu peito, como se fosse natural, como se fosse óbvio, como se fosse destino.</p>
<br>
<p>Eu nunca tinha sentido nada assim por ninguém. Nunca. Eu sempre fui fechado, sempre fui desconfiado, sempre fui alguém que guardava tudo pra dentro. Mas com vc foi diferente desde o início. Não precisei me forçar, não precisei me convencer, não precisei construir nada. Foi como se o meu coração tivesse visto o seu e dito, "é aqui". Simples assim. Forte assim.</p>
<br>
<p>E quanto mais eu lembrava disso, mais eu entendia que aquele primeiro momento, aquele primeiro detalhe, aquela primeira conversa, aquele primeiro "oi" que parecia normal, tinha sido o início de algo que mudaria absolutamente tudo na minha vida. Pq foi ali que o meu coração começou a se moldar no formato do seu sem nem pedir permissão.</p>
<br>
<p>Vc foi a primeira pessoa que fez minha alma respirar fundo. A primeira que fez o meu peito bater diferente. A primeira que fez meu futuro ganhar rosto. A primeira que fez meus medos ficarem menores e meus sonhos ficarem maiores. E tudo isso começou naquele dia. No começo que parecia comum, mas que hoje eu sei... foi o primeiro capítulo do melhor caminho que eu poderia ter encontrado.</p>
<br>
<p>E se eu tivesse que voltar no tempo e escolher um ponto exato onde tudo começou, onde minha vida começou a mudar de verdade, onde eu deixei de andar sozinho... seria esse. O dia em que vc entrou, mesmo sem perceber, e virou o centro da minha história sem esforço nenhum.</p>
<br>
<p style="font-style:italic; color: var(--accent);">Porque o começo de nós dois não foi barulhento, nem complicado, nem grandioso. Foi verdadeiro. Foi inesperado. Foi real. E foi suficiente pra eu saber que dali em diante... nada mais seria igual.</p>
`;


(function initLivroTyping() {
    const contId = 'livroContent';
    const button = document.getElementById('voltarLivroBtn');
    
    if (button) {
        button.style.opacity = 0;
        button.style.pointerEvents = 'none';
        button.style.transition = 'opacity 0.5s';
    }

    typeText(contId, BOOK_CONTENT, 20, () => { 
        if (button) {
            button.style.opacity = 1;
            button.style.pointerEvents = 'auto';
        }
    });
})();