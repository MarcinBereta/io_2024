import matplotlib.pyplot as plt
import math
import os


def count(column):
    cat_count = {}
    for var in column:
        if var not in cat_count:
            cat_count[var] = 1
        else:
            cat_count[var] += 1
    cat = list(cat_count.keys())
    amount = list(cat_count.values())

    return cat, amount


def count_graph(column, label):
    cat, quantity = count(column)

    yint = range(min(quantity), math.ceil(max(quantity)) + 1)

    plt.bar(cat, quantity)
    plt.xlabel("Categories")
    plt.xticks(rotation=30)
    plt.ylabel("Count")
    plt.yticks(yint)
    plt.title(f"Number of {label}")
    plt.tight_layout()

    file_name = f'{label}_cat_count.png'
    path = os.path.join(os.path.dirname(__file__), f'../../../graphs', file_name)
    plt.savefig(path)
    plt.clf()
    return f'/graphs/{file_name}'


def count_perc_graph(column, label):
    cat, quantity = count(column)

    plt.pie(quantity, autopct='%1.1f%%')
    plt.title(f"Percentage of {label}")
    plt.legend(cat, loc='best')
    plt.axis('equal')
    plt.tight_layout()

    file_name = f'{label}_cat_count_perc.png'
    path = os.path.join(os.path.dirname(__file__), f'../../../graphs', file_name)
    plt.savefig(path)
    plt.clf()
    return f'/graphs/{file_name}'
