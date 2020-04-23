import os
import csv
import glob
import re
import collections
from collections import defaultdict

PATH = 'test-files/'
import json
from glob import glob
from nltk.stem import PorterStemmer
import pymongo
from pymongo import MongoClient
import datetime
import pprint
from nltk.tokenize import sent_tokenize, word_tokenize
import collections
from math import sqrt

def Porter_filter_list(word_list):
    ps = PorterStemmer()
    stopwords = []
    for w in word_list:
        stopwords.append(ps.stem(w))
    return stopwords


def Porter_filter(word):
    ps = PorterStemmer()
    return ps.stem(word)

def exceptions_filter():
    f = open('exceptions.txt','r')
    exceptions = f.readlines()
    exceptions = [word.lower().strip() for word in exceptions]
    f.close()
    return exceptions


def stopwords_filter():
    f = open('stopwords.txt', 'r')
    stopwords = f.readlines()
    stopwords = [word.lower().strip() for word in stopwords]
    f.close()
    return stopwords

dict_ultra_final = {'path': '', 'words': {'word': {}}}

def read_one_file_from_dir(root_dir, stopwords, exceptions):
    d = {}
    directory = os.path.normpath(root_dir)
    for filename in glob(directory):
        with open(filename, encoding="latin1") as f:
            letter = f.read(1).lower()
            word = ''
            full_word = ''
            while letter:
                if letter >= 'a' and letter <= 'z' or letter == "'":
                    word += letter
                elif letter == ' ' or letter == '\n' or letter == '\t':
                    full_word = word
                    word = ''
                    parsed_word = Porter_filter(full_word)
                    if parsed_word in exceptions:
                        if parsed_word in d:
                            d[parsed_word] = d[parsed_word] + 1
                        else:
                            d[parsed_word] = 1
                    if parsed_word not in stopwords:
                        if parsed_word in d:
                            d[parsed_word] = d[parsed_word] + 1
                        else:
                            d[parsed_word] = 1
                    full_word = ''
                letter = f.read(1).lower()
        dict_ultra_final['words'] = d
    return d


def save_idx_file():
    root_dir = "C:\\Users\\Ali-PC\\PycharmProjects\\RIW_project\\venv\\test-files"
    file_set = set()
    file_list = ''
    for root, dirs, files in os.walk(root_dir):
        for file_name in files:
            rel_dir = os.path.abspath(root)
            rel_file = os.path.join(rel_dir, file_name)
            file_list = file_list + str(rel_file) + '\n'
    with open("idx_file.txt", "w") as output:
        output.write(file_list)


def parse_idx_file(idx_direct_collection):
    data = []
    start = 0
    index_direct = {}
    exceptions = exceptions_filter()
    exceptions = Porter_filter_list(exceptions)
    stopwords = stopwords_filter()
    stopwords = Porter_filter_list(stopwords)
    mg_dict = dict_ultra_final
    dict_final = {}
    with open('idx_file.txt') as f:
        for line in f:
            line = line.rstrip()
            path = line.split('.')
            data.append(line)
            d = read_one_file_from_dir(data[start], stopwords, exceptions)
            dict_final[path[0]] = d
            mg_dict['path'] = path[0]
            #print(dict_ultra_final)
            #idx_direct_coll.insert_one(dict_ultra_final.copy()).inserted_id
            start += 1

    # with open("idx_direct.json", "w") as output:
    #     output.write(json.dumps(index_direct))
# index invers
boolean_list = []


def index_invers(idx_invers_coll):
    data = []
    expr = []
    exc = []
    expr_OR = []
    i = 0
    calcul_cos = 0
    path_list = []
    with open('read_complex.txt') as f:
        for line in f:
            if i == 0:
                line = line.rstrip()
                expr.append(line)
                i = i + 1
            line = line.rstrip()
            if line == '+':
                line = next(f)
                line = line.rstrip()
                expr.append(line)
            if line == '|':
                line = next(f)
                line = line.rstrip()
                expr_OR.append(line)
    cnt = 0
    expr_final = []
    dictionar_nr_ap = {}
    dict_path = {}
    the_list=[]
    if len(expr) >= len(expr_OR):
        expr_final = expr
    else:
        expr_final = expr_OR
    with open("idx_direct.json") as json_file:
        data = json.load(json_file)
        cuv_obl_list = []
        cuv_opt_list = []
        cuv_exc = ''
        cuv_opt = ''
        for key in data:
            while(cnt < len(expr_final)):
                if cnt < expr_OR.__len__():
                    cuv_opt = expr_OR[cnt]
                if cnt < expr.__len__():
                    cuv_oblig = expr[cnt]
                cnt += 1
                cuv_oblig = Porter_filter(cuv_oblig)
                cuv_opt = Porter_filter(cuv_opt)
                for key_cuv in data[key]: # c:users..22.txt { bla_bla : 520, lol: 120, .....
                    if key_cuv == cuv_opt or key_cuv == cuv_oblig:
                        if key_cuv in dictionar_nr_ap:
                            dictionar_nr_ap[key_cuv] += data[key][key_cuv]
                        else:
                            dictionar_nr_ap[key_cuv] = data[key][key_cuv]
                        if key_cuv not in dict_path:
                            dict_path[key_cuv] = []
                        if key not in dict_path[key_cuv]:
                            dict_path[key_cuv].append(key)

            cnt = 0
            cuv_obl_list = []
            cuv_opt_list = []
        for key in data:
            while (cnt < len(expr_final)):
                if cnt < expr_OR.__len__():
                    cuv_opt = expr_OR[cnt]
                if cnt < expr.__len__():
                    cuv_oblig = expr[cnt]
                cnt += 1
                cuv_oblig = Porter_filter(cuv_oblig)
                cuv_opt = Porter_filter(cuv_opt)
                for key_cuv in data[key]:
                    if key_cuv == cuv_opt or key_cuv == cuv_oblig:
                        dict_index_invers = {'word': key_cuv,
                                             'details': {'path': dict_path[key_cuv], 'nr_ap': dictionar_nr_ap[key_cuv]}}
                        if dict_index_invers not in the_list:
                            #idx_invers_coll.insert_one(dict_index_invers.copy()).inserted_id
                            the_list.append(dict_index_invers)
                            if dict_path[key_cuv] not in boolean_list:
                                boolean_list.append(dict_path[key_cuv])

            cnt = 0
            cuv_obl_list = []
            cuv_opt_list = []

    return the_list


def boolean_search(bool_list = boolean_list):
    final_list = []
    for item in bool_list:
        if item not in final_list:
            final_list = final_list + item
    return set(final_list)

# cos function applied to words
def cos_relevance(path_list, final_list):
    parsed_words = []
    with open('prop.txt', 'r') as file:
        for line in file:
            for word in line.split():
                parsed_words.append(Porter_filter(word))
    for word in parsed_words:
        collection.find(word)


if __name__ == "__main__":
    client = MongoClient("mongodb+srv://admin:admin@cluster0-yr7sj.mongodb.net/test?retryWrites=true&w=majority")

    db = client['riw_proj']
    idx_direct_coll = db['idx_direct']
    idx_invers_coll = db['idx_invers']
    # save_idx_file()
    #the_list = parse_idx_file(idx_direct_coll)
    # complex_data_structures()
    index_invers(idx_invers_coll)

    list = boolean_search()
    print(list)