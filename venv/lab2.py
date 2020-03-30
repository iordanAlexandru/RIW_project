import os
import csv
import glob
import collections
PATH='test-files/'
import json
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize, word_tokenize


def Porter_filter_list(word_list):
    ps = PorterStemmer()
    stopwords = []
    for w in word_list:
        stopwords.append(ps.stem(w))
    print(stopwords)
    return stopwords

def Porter_filter(word):
    ps = PorterStemmer()
    return ps.stem(word)


def stopwords_and_exceptions():
    f = open('stopwords.txt', 'r')
    stopwords = f.readlines()
    stopwords = [word.lower().strip() for word in stopwords]
    f.close()
    return stopwords

def read_from_dir(PATH):
    d= dict()
    stopwords = stopwords_and_exceptions()
    for filename in glob.glob(os.path.join(PATH, '*.txt')):
        with open(filename, encoding="latin1") as f:
            letter = f.read(1).lower()
            word = ''
            full_word = ''
            while letter:
                if letter >='a' and letter <='z' or letter== "'" :
                    word += letter
                elif letter == ' ' or '\n' or '\t':
                    full_word= word
                    word=''
                    if full_word in d and full_word not in stopwords:
                        d[full_word] = d[full_word] + 1
                    elif full_word not in stopwords:
                        d[full_word]=1
                    full_word=''
                letter = f.read(1).lower()
    return d


def read_one_file_from_dir(root_dir, stopwords):
    d= dict()
    directory = os.path.normpath(root_dir)
    for filename in glob.glob(directory):
        with open(filename, encoding="latin1") as f:
            letter = f.read(1).lower()
            word = ''
            full_word = ''
            while letter:
                if letter >= 'a' and letter <= 'z' or letter == "'":
                    word += letter
                elif letter == ' ' or '\n' or '\t':
                    full_word = word
                    word = ''
                    parsed_word = Porter_filter(full_word)
                    if parsed_word in d and parsed_word not in stopwords:
                        d[parsed_word] = d[parsed_word] + 1
                    elif parsed_word not in stopwords:
                        d[parsed_word] = 1
                    full_word = ''
                letter = f.read(1).lower()
        return d

def save_idx_file():
    root_dir = "C:\\Users\\Ali-PC\\PycharmProjects\\RIW_project\\venv\\test-files"
    file_set = set()
    file_list = ''
    for root, dirs, files in os.walk(root_dir):
        for file_name in files:
            rel_dir = os.path.abspath(root)
            rel_file = os.path.join(rel_dir, file_name)
            file_list= file_list + str(rel_file) + '\n'
    print(file_list)
    with open("idx_file.txt", "w") as output:
        output.write(file_list)

def parse_idx_file():
    data = []
    start = 0
    index_direct ={}
    stopwords = stopwords_and_exceptions()
    stopwords = Porter_filter_list(stopwords)
    with open('idx_file.txt') as f:
        for line in f:
            line = line.rstrip()
            data.append(line)
            d = read_one_file_from_dir(data[start], stopwords)
            index_direct[line] = d
            start += 1
    # for key in list(index_direct.keys()):
    #     print(key, ":", index_direct[key])
    with open("idx_direct.json", "w") as output:
        output.write(json.dumps(index_direct))


def CountFrequency(arr):
    return collections.Counter(arr)

def complex_data_structures():
    data = []
    expr=[]
    exc=[]
    expr_OR=[]
    i=0
    with open('read_complex.txt') as f:
        for line in f:
            if i == 0:
                line = line.rstrip()
                expr.append(line)
                i=i+1
            line = line.rstrip()
            if line == '+':
                line = next(f)
                line = line.rstrip()
                expr.append(line)
            if line == '-':
                line = next(f)
                line = line.rstrip()
                exc.append(line)
            if line == '|':
                line = next(f)
                line = line.rstrip()
                expr_OR.append(line)

    cnt=0
    dict_final = []
    expr_final = []
    if len(expr) >= len(expr_OR):
        expr_final=expr
    else:
        expr_final = expr_OR
    with open("idx_direct.json") as json_file:
        arr=[]
        flag = -1
        dict_nou = []
        data = json.load(json_file)
        cuv_obl_list = []
        cuv_opt_list = []
        cuv_exc = 'zzzzzzz'
        cuv_opt='zzzzzzzzz'
        for key in data.keys():
            while cnt < len(expr_final):
                if cnt < expr.__len__():
                    cuv_oblig = expr[cnt]
                if cnt < exc.__len__():
                    cuv_exc = exc[cnt]
                if cnt < expr_OR.__len__():
                    cuv_opt = expr_OR[cnt]
                cnt = cnt + 1
                flag = 0
                cuv_oblig= Porter_filter(cuv_oblig)
                cuv_opt = Porter_filter(cuv_opt)
                cuv_exc = Porter_filter(cuv_exc)
                for key_cuv in data[key]:
                    if key_cuv == cuv_oblig and cuv_oblig not in cuv_obl_list:
                        cuv_obl_list.append(cuv_oblig)
                    if key_cuv == cuv_opt and cuv_opt not in cuv_opt_list:
                        cuv_opt_list.append(cuv_opt)
                    if key_cuv == cuv_exc:
                        flag=1
                        break
                if len(cuv_obl_list) == len(expr) and len(cuv_opt_list)<= len(expr_OR) and key not in dict_final:
                    dict_final.append(key)
            cnt = 0
            cuv_obl_list=[]
            cuv_opt_list=[]
    print(dict_final)



if __name__ == "__main__":
    #save_idx_file()
    #parse_idx_file()
    complex_data_structures()

