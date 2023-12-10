import dotenv from "dotenv"
dotenv.config()

import fs from "fs"


//Function to convert PDF pages to images
// async function convertPageToImage(pdfPath, pageNumber, outputPath) {
//   const options = {
//     density: 400,
//     saveFilename: `page${pageNumber}`,
//     savePath: outputPath,
//     format: 'png',
//     width: 1920,
//     height: 1080
//   };

//   const convert = fromPath(pdfPath, options);
//   return await convert(pageNumber);
// }


//openai
import OpenAI from "openai"
let totalTokensUsed = 0

const openai_key = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: openai_key })

async function chatgpt(text, instructions) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: text },
            { role: 'system', content: instructions },
        ],
        temperature: 0,
    })

    totalTokensUsed += response.usage.total_tokens
    return response.choices[0].message.content
}

let argomenti = [
    {
        nome: "Numeri naturali e interi",
        sottocategorie: [
            "Operazioni (addizione, sottrazione, moltiplicazione, divisione)",
            "Proprietà delle operazioni",
            "Divisibilità",
            "Numeri primi e composti",
            "Massimo comune divisore e minimo comune multiplo",
            "Numeri interi e loro proprietà"
        ]
    },
    {
        nome: "Frazioni e numeri razionali",
        sottocategorie: [
            "Definizione di frazione",
            "Operazioni con le frazioni",
            "Proprietà delle frazioni",
            "Numeri decimali e periodici",
            "Confronto tra frazioni e numeri razionali"
        ]
    },
    {
        nome: "Numeri reali",
        sottocategorie: [
            "Numeri irrazionali",
            "Approssimazioni e arrotondamenti",
            "Radici e potenze con esponente reale",
            "Intervallo di numeri reali"
        ]
    },
    {
        nome: "Operazioni aritmetiche",
        sottocategorie: [
            "Ordine delle operazioni",
            "Proprietà distributiva, commutativa e associativa",
            "Operazioni con le potenze e le radici",
            "Operazioni con i numeri negativi"
        ]
    },
    {
        nome: "Potenze e radici",
        sottocategorie: [
            "Definizione di potenza",
            "Proprietà delle potenze",
            "Radici quadrate e cubiche",
            "Proprietà delle radici"
        ]
    },
    {
        nome: "Espressioni algebriche",
        sottocategorie: [
            "Monomi e polinomi",
            "Operazioni con monomi e polinomi",
            "Prodotti notevoli",
            "Scomposizione di polinomi",
            "Frazioni algebriche e operazioni"
        ]
    },
    {
        nome: "Equazioni e disequazioni",
        sottocategorie: [
            "Equazioni di primo grado",
            "Equazioni di secondo grado",
            "Sistemi di equazioni",
            "Equazioni di grado superiore",
            "Equazioni fratte",
            "Disequazioni di primo e secondo grado",
            "Sistemi di disequazioni"
        ]
    },
    {
        nome: "Geometria euclidea",
        sottocategorie: [
            "Punti, rette, segmenti e angoli",
            "Poligoni e loro proprietà",
            "Circonferenza e cerchio",
            "Aree e perimetri",
            "Solidi geometrici e loro volumi",
            "Teoremi geometrici fondamentali"
        ]
    },
    {
        nome: "Teorema di Pitagora",
        sottocategorie: [
            "Enunciato e dimostrazione",
            "Applicazioni del teorema",
            "Triangoli rettangoli speciali"
        ]
    },
    {
        nome: "Geometria analitica",
        sottocategorie: [
            "Coordinate nel piano cartesiano",
            "Equazione della retta",
            "Circonferenza e altre coniche",
            "Distanza tra due punti e punto-medio di un segmento"
        ]
    },
    {
        nome: "Funzioni e loro proprietà",
        sottocategorie: [
            "Definizione di funzione",
            "Dominio e codominio",
            "Funzioni iniettive, suriettive e biiettive",
            "Funzioni lineari, quadratiche, esponenziali e logaritmiche",
            "Grafici di funzioni e loro trasformazioni"
        ]
    },
    {
        nome: "Calcolo combinatorio",
        sottocategorie: [
            "Principio di moltiplicazione e di addizione",
            "Permutazioni, disposizioni e combinazioni",
            "Coefficienti binomiali e triangolo di Tartaglia"
        ]
    },
    {
        nome: "Probabilità",
        sottocategorie: [
            "Definizione classica e frequentista di probabilità",
            "Eventi indipendenti e dipendenti",
            "Probabilità condizionata",
            "Teorema di Bayes"
        ]
    },
    {
        nome: "Statistica",
        sottocategorie: [
            "Raccolta e organizzazione dei dati",
            "Media, mediana, moda",
            "Varianza e deviazione standard",
            "Distribuzioni di frequenza e istogrammi"
        ]
    },
    {
        nome: "Trigonometria",
        sottocategorie: [
            "Rapporti trigonometrici nel triangolo rettangolo",
            "Funzioni trigonometriche e loro grafici",
            "Formule di addizione e sottrazione",
            "Equazioni e disequazioni trigonometriche"
        ]
    },
    {
        nome: "Calcolo differenziale",
        sottocategorie: [
            "Limiti di funzioni",
            "Continuità",
            "Derivate e regole di derivazione",
            "Studio di funzione e grafico"
        ]
    },
    {
        nome: "Calcolo integrale",
        sottocategorie: [
            "Integrale indefinito",
            "Metodi di integrazione",
            "Integrale definito e sue applicazioni",
            "Teorema fondamentale del calcolo"
        ]
    }
];

async function generateBook(){
    // for (let i = 0; i < argomenti.length; i++) {

    //     for (let j = 0; j < argomenti[i].sottocategorie.length; j++) {
    //         const content = `Start writing a book, do not go out of context, from the moment you start the book you will focus on the book. you are a book writer and a math teacher. Be detailed, a student should be able to rely on this book, put examples and exercises as well, it needs to be concise and complete.`
    //         const system = `The curret topics name is ${argomenti[i].nome} and we are currently at the following subcategory: ${argomenti[i].sottocategorie[j]}. You are a high school teacher and you are writing a book about math. Write everything you know to make as straightforward possible for the kids. Everything should be done in italian`
    //         fs.appendFile('math_book.txt', `**${argomenti[i].nome}**\n${argomenti[i].sottocategorie[j]}\n${await chatgpt(content, system)}\n\n\n`, (err) => {
    //             if (err) {
    //                 console.error('Error writing to file:', err);
    //             } else {
    //                 console.log('Book content written to math_book.txt');
    //             }
    //         });
    //     }
    // }
    let test = await chatgpt('give ma an array called topics with interesting studies, no other output except for the array is allowed', 'output just the array, no other output is allowed')
    console.log(test)
}

generateBook()