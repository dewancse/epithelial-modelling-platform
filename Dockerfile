FROM nginx:alpine

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache python3 \
                       python3-dev \
                       build-base \
                       git && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    pip3 install git+git://github.com/channelcat/sanic.git@master && \
    pip3 install Sphinx && \
    pip3 install SPARQLWrapper && \
    apk --no-cache add cmake make && \
    apk --no-cache add doxygen libxml2-dev swig && \
    apk add --no-cache libxslt-dev && \
    pip3 install lxml && \
    git clone https://github.com/cellml/libcellml.git && \
    cd libcellml && \
    mkdir build && \
    cd build && \
    cmake ../ -DBINDINGS_PYTHON=ON -DBUILD_SHARED=ON -DBUILD_TYPE=Debug -DCOVERAGE=ON -DINSTALL_PREFIX=/ -DTREAT_WARNINGS_AS_ER=ON -DUNIT_TESTS=ON && \  
    make -j && \
    make test && \
    cd ../../ && \
    apk del python3-dev \
            build-base \
            git && \
    rm -r /root/.cache

ENV PYTHONPATH=/libcellml/build/src/bindings/python

COPY server/server.py server/main.py server/miscellaneous.py server/cellml1to2.xsl entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
