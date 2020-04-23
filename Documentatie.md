# RIW_project
Documentatie proiect RIW
Etapa 1

	In functia main() stabilesc conexiunea la mongoDB, baza de date si colectiile aferente. Main-ul este alcatuit din mai multe functii care reprezinta laboratoarele. Din pacate, n-am reusit sa fac ultima parte, calculul cosinusul.

1)	Save_idx_file – preia un director in care se gasesc fisierele text. In acest director sunt si sub-directoare cu fisiere text. Folosesc functia os.walk pt a “merge” prin fiecare subdirector si sa identific pathul fiecarui fisier text. Toate aceste pathuri le scriu intr-un fisier text sub forma de lista.


2)	Parse_idx_file – functia are un parametru care reprezinta colectia din mongoDB.  Prima data aduc exceptiile, stopwordurile la forma de baza utilizand algoritmul Porter.
	Am ales Porter si nu Stemming deoarece Python are optimizata aceasta biblioteca si este mai usor de implementat.
	Ma folosesc de un dictionar declarant global pentru a pastra structura si continutul acestuia intre functii. Astfel, acesta contine pathul catre fisierul text si cuvintele. 
	Folosesc o functie de citire a unui fisier text care are ca parametru pathul fisierului text, stopwords si exceptiile. Citesc fiecare cuvant, intai il trec prin filtrul de exceptii, iar apoi dupa prin filtrul de stopworduri. Dictionarul declarat global il folosesc pentru a retine cuvintele din functia read_one_file_from_directory (valoarea) si in alta functie sa pot completa cu cheia acestora, pathul. Am facut acest split din cauza ca mongoDB nu ma lasa sa inserez “:” de la terminatia pathului.


3)	Index_invers – este functia care construieste indexul invers. Citesc dintr-un fisier cuvintele care au intre ele niste operatori: ‘-’, ‘|’, ‘+’ pentru cuvinte optionale in query, obligatorii si exceptii. Fiecare dintre aceste cuvinte le interpretez in functie de semnul de dinaintea lor. Primul cuvant este obligatoriu intotdeauna. Citesc idx_direct sip t fiecare cheie din acesta, vad daca exista cuvantul cautat de mine in acel document. Daca da, adun nr de aparitii al acestora. Este necesar sa am doua bucle, una care aduna nr de aparitii al cuvantului din toate documentele, iar a doua pentru a inregistra intr-o lista de dictionare cuvantul, pathul si nr total de aparitii. De asemenea, inserez in MongoDB sub forma unui dictionar datele inregistrate.
4)	Boolean_search returneaza o lista care contine reuniunea tuturor pathurilor care contin un anumit cuvant / set de cuvinte. 





 
 
 






