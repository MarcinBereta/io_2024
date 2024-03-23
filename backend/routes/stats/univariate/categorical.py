import matplotlib.pyplot as plt
import math


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


def count_graph(column):
    cat, quantity = count(column)

    yint = range(min(quantity), math.ceil(max(quantity)) + 1)

    plt.bar(cat, quantity)
    plt.xlabel("Categories")
    plt.xticks(rotation=30)
    plt.ylabel("Count")
    plt.yticks(yint)
    plt.title("Number of categories")
    plt.tight_layout()
    plt.savefig('../../graphs/cat_count.png')
    plt.show()


def count_perc_graph(column):
    cat, quantity = count(column)

    plt.pie(quantity, labels=cat, autopct='%1.1f%%')
    plt.title("Percentages of categories")
    plt.legend(loc='best')
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig('../../graphs/cat_count_perc.png')
    plt.show()

