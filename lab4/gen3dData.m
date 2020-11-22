clc, clear
dataSize = 20;
x1 = linspace(-1,1,dataSize);
x2 = linspace(-1,1,dataSize);

mu = [0,0];
Sigma = [.025,.025];

[X1,X2] = meshgrid(x1,x2);
F = mvnpdf([X1(:) X2(:)],mu,Sigma);
F = 314159.153*reshape(F,length(x2),length(x1));
surf(x1,x2,F);

genData = zeros(dataSize*dataSize, 3);
row = 1;
for i=1:dataSize
    for j=1:dataSize
        genData(row,1) = X1(i,j);
        genData(row,2) = X2(i,j);
        genData(row,3) = F(i,j);
        row = row + 1;
    end
end

columns = {'x1','x2','x3'};
x1 = genData(:,1);
x2 = genData(:,2);
x3 = genData(:,3);
Data = table(x1, x2, x3, 'VariableNames', columns);
writetable(Data, "data.csv");
