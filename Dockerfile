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
    pip3 install wheel && \
    pip3 install git+git://github.com/channelcat/sanic.git@master && \
    pip3 install SPARQLWrapper && \
    apk --no-cache add cmake make && \
    apk --no-cache add doxygen libxml2-dev swig && \
    apk add --no-cache libxslt-dev && \
    pip3 install lxml && \
    mkdir libcellml && cd libcellml && \
    git clone https://github.com/cellml/libcellml.git && mv libcellml src &&\
    mkdir build && cd build && \
    cmake -DCOVERAGE=OFF -DUNIT_TESTS=OFF -DPython_EXECUTABLE=/usr/bin/python3 -DBUILD_TYPE=Release ../src && \
    make -j && \
    pip3 install -e src/bindings/python && \
    apk del python3-dev \
            build-base \
            git && \
    rm -r /root/.cache

# pip installing so shouldn't need this
# ENV PYTHONPATH=/libcellml/build/src/bindings/python

COPY server/server.py server/main.py server/miscellaneous.py server/cellml1to2.xsl entrypoint.sh /

# ENTRYPOINT ["/entrypoint.sh"]