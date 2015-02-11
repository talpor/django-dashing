import os
from setuptools import setup

README = open(os.path.join(os.path.dirname(__file__), 'README.rst')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django-dashing',
    version='0.2.3',
    packages=['dashing'],
    include_package_data=True,
    license='BSD License',
    description='A simple Django dashboard app to visualize interesting data about your project.',
    long_description=README,
    url='https://github.com/talpor/django-dashing/',
    author='Mauricio Reyes',
    author_email='mreyes@talpor.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License', # example license
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Software Development :: Localization',
        'Topic :: Utilities',
    ],
    keywords=['django', 'metrics', 'dashboard', 'dashing', 'metric', 'widgets', 'data'],
)