import os
from setuptools import setup

README = open(os.path.join(os.path.dirname(__file__), 'README.rst')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django3-dashing',
    version='0.5.0',
    packages=['dashing'],
    include_package_data=True,
    license='MIT License',
    description='A simple Django (v3 which requires Python 3) dashboard app to visualize interesting data '
                'about your project.',
    long_description=README,
    url='https://github.com/wickeyware/django-dashing/',
    author='Michael Wickey',
    author_email='wickeym@gmail.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Software Development :: Localization',
        'Topic :: Utilities',
    ],
    keywords=['django', 'python3', 'metrics', 'dashboard', 'dashing', 'metric',
              'widgets', 'data'],
)
