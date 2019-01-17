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

COPY server.py entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

# COPY server.py /
# ENTRYPOINT ["/bin/sh", "-c", "nginx -g 'daemon off;'; python3 server.py"]

# ENTRYPOINT python3 server.py && nginx -g "daemon off;"
# CMD ["nginx", "-g", "daemon off;"]
# CMD ["/bin/sh", "-c", "nginx -g 'daemon off;' && python3 server.py"]
